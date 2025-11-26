import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { PaymentsModel } from "../../../model/quotationModel/paymentsModel";
import mongoose from "mongoose";

export const updatePayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const paymentId = req.params.id;
    const {
      quotationId,
      amountPaid,
      paymentDate,
      paymentMethod,
      payment_person,
    } = req.body;

    if (!paymentId) {
      session.endSession();
      return res.status(400).json({ error: "Payment ID not found." });
    }
    if (
      !quotationId ||
      amountPaid === null ||
      amountPaid === undefined ||
      !paymentDate ||
      !paymentMethod ||
      !payment_person
    ) {
      session.endSession();
      return res.status(400).json({ error: "All required fields are needed." });
    }
    const parsedAmountPaid = parseFloat(amountPaid);
    if (isNaN(parsedAmountPaid) || parsedAmountPaid < 0) {
      session.endSession();
      return res.status(400).json({ error: "Invalid payment amount." });
    }

    // --- 2. Fetch Payment and Quotation (in session) ---
    const getPrevPayment = await PaymentsModel.findById(paymentId).session(
      session
    );
    if (!getPrevPayment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Payment record not found." });
    }

    // Store old amount for recalculation
    const oldAmountPaid = getPrevPayment.amountPaid;

    const getQuotationDetails = await VehicleQuotationModel.findById(
      quotationId
    ).session(session);
    if (!getQuotationDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Quotation not found!" });
    }

    // --- 3. Recalculate Totals (Isolating the payment being updated) ---

    // Get all payments for this quotation
    const allPayments = await PaymentsModel.find({ quotationId }).session(
      session
    );

    // Calculate total paid *EXCLUDING* the old value of the payment being updated
    const totalPaid_BeforeUpdate =
      allPayments.reduce((acc, payment) => acc + payment.amountPaid, 0) -
      oldAmountPaid;

    // Calculate the total paid *AFTER* this new update
    const totalPaid_AfterUpdate = totalPaid_BeforeUpdate + parsedAmountPaid;

    // Calculate the new pending amount
    const newPendingAmount =
      getQuotationDetails.totalAmount - totalPaid_AfterUpdate;

    // --- 4. Overpayment/Validation Checks ---
    if (totalPaid_AfterUpdate > getQuotationDetails.totalAmount + 0.001) {
      // Overpayment check
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: `The total paid amount of ${totalPaid_AfterUpdate.toFixed(
          2
        )} exceeds the quotation total of ${getQuotationDetails.totalAmount.toFixed(
          2
        )}.`,
      });
    }

    // --- 5. Determine New Status ---
    // paymentStatus enum: ["pending", "partial", "completed"]
    const newPaymentStatus =
      newPendingAmount <= 0.001 ? "completed" : "partial";

    // If the quotation was previously fully paid, but the new amount makes it partial, update to partial.

    // --- 6. Update Records (Writes) ---

    // A) Update the Payment Record
    const updatedPayment = await PaymentsModel.findByIdAndUpdate(
      paymentId,
      {
        quotationId,
        totalAmount: getQuotationDetails.totalAmount, // Retain consistency
        amountPaid: parsedAmountPaid, // The new amount
        pendingAmount: newPendingAmount, // The new pending amount
        paymentDate,
        payment_person,
        paymentMethod,
        status: newPaymentStatus,
      },
      { new: true, session } // 'new: true' returns the updated document
    );

    // B) Update the Quotation Record
    await VehicleQuotationModel.findByIdAndUpdate(
      quotationId,
      {
        paymentStatus: newPaymentStatus,
        pendingAmount: newPendingAmount,
      },
      { session }
    );

    // --- 7. Commit & Respond ---
    await session.commitTransaction();

    return res.status(200).json({
      success: "Payment updated successfully.",
      payment: updatedPayment?.toObject(),
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Payment update transaction failed:", error);
    return res.status(500).json({ error: "Internal server error!" });
  } finally {
    session.endSession();
  }
};

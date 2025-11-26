import { Request, Response } from "express";
import { PaymentTypes } from "../../../types/paymentTypes";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { PaymentsModel } from "../../../model/quotationModel/paymentsModel";
import mongoose from "mongoose";
export const newPayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      quotationId,
      amountPaid,
      paymentDate,
      paymentMethod,
      payment_person,
    } = req.body;

    if (
      !quotationId ||
      amountPaid === null ||
      amountPaid === undefined ||
      !paymentDate ||
      !paymentMethod ||
      !payment_person
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const getQuotationDetails = await VehicleQuotationModel.findById(
      quotationId
    ).session(session);

    if (!getQuotationDetails) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Quotation not found!" });
    }

    const existingPayments = await PaymentsModel.find({
      quotationId,
    }).session(session);

    const totalAlreadyPaid = existingPayments.reduce(
      (acc, payment) => acc + payment.amountPaid,
      0
    );

    const currentPendingAmount =
      getQuotationDetails.totalAmount - totalAlreadyPaid;

    if (amountPaid > currentPendingAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error: `Payment of ${amountPaid} exceeds the pending amount of ${currentPendingAmount}.`,
      });
    }
    const newPendingAmount = currentPendingAmount - amountPaid;
    const newPaymentStatus =
      newPendingAmount <= 0.001 ? "completed" : "partial";

    if (totalAlreadyPaid >= getQuotationDetails.totalAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "This quotation is already fully paid.",
      });
    }

    if (getQuotationDetails.status === "accepted") {
      const newPayment = await PaymentsModel.create(
        [
          {
            quotationId,
            totalAmount: getQuotationDetails.totalAmount,
            amountPaid,
            pendingAmount: newPendingAmount,
            paymentDate,
            payment_person,
            paymentMethod,
            status: newPaymentStatus,
          },
        ],
        { session }
      );

      if (!newPayment) {
        throw new Error("Payment creation failed.");
      }

      await VehicleQuotationModel.findByIdAndUpdate(
        quotationId,
        {
          paymentStatus: newPaymentStatus,
          pendingAmount: newPendingAmount,
        },
        { session }
      );
    } else {
      await session.abortTransaction();
      return res.status(409).json({ error: "This quotation is not accepted." });
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: "New payment added successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal server error!" });
  } finally {
    session.endSession();
  }
};

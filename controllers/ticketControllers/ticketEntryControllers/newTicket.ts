import { Request, Response } from "express";
import mongoose from "mongoose";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";
import { ITicketBookingDocument } from "../../../model/ticketModel/ticketBookingModel"; // Assuming your model export includes this interface
import { FundsLedger } from "../../../model/ticketModel/fundsLedgerModel";
import { FundsLedgerTypes } from "../../../types/fundsLedgerTypes";

// Note: You might need to update your types file to include the IPayment structure if not already done.

export const newTicket = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      clientId,
      bookingDate,
      departureFrom,
      destinationTo,
      departureDate,
      airlineName,
      flightNumber,
      seatClass,
      noOfPassengers,
      baseFare,
      taxesAndFees,
      totalAmount,
      initialPaymentAmount,
      initialPaymentMethod,
      initialTransactionId,
      bookedBy,
      issuedTicketNumber,
      remarks,
    } = req.body;

    if (
      !clientId ||
      !bookingDate ||
      !departureFrom ||
      !destinationTo ||
      !departureDate ||
      !totalAmount ||
      !bookedBy ||
      !issuedTicketNumber
    ) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "All required booking details must be provided." });
    }

    // --- 2. Initial Payment Validation (Similar to newTrip) ---
    const totalFare = Number(totalAmount);
    const initialPaidAmount = Number(initialPaymentAmount) || 0;

    if (initialPaidAmount > totalFare) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error:
          "Initial paid amount cannot be greater than the total ticket amount.",
      });
    }

    if (
      initialPaidAmount > 0 &&
      (!initialPaymentMethod || initialPaymentMethod === "none")
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        error:
          "A valid payment method is required for an initial payment amount greater than zero.",
      });
    }

    // --- 3. Prepare Payments Array ---
    const initialPayments = [];

    if (initialPaidAmount > 0) {
      initialPayments.push({
        amount: initialPaidAmount,
        paymentMethod: initialPaymentMethod,
        transactionId: initialTransactionId,
        date: new Date(),
      });
    }

    // --- 4. Check Client Exists (Ensure session is passed) ---
    const checkClientExists = await ClientsModel.findById(clientId)
      .lean()
      .session(session);

    if (!checkClientExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Client not found." });
    }

    // --- check balance available or not in funds ledger

    const checkLedger = await FundsLedger.findOne({
      airline: airlineName,
    })
      .lean<FundsLedgerTypes>()
      .session(session);

    if (!checkLedger) {
      return res.status(400).json({
        error: "Airline not found in Ledger.",
      });
    }

    if (checkLedger.balance < totalAmount) {
      return res.status(400).json({
        error:
          "Ticket amount is more than available balance. Please load balance and try again.",
      });
    }
    const updateBalanceToLedger = await FundsLedger.findByIdAndUpdate(
      checkLedger._id,
      {
        $inc: { balance: -totalAmount },
      },
      { session }
    );

    // --- 5. Create Ticket Booking ---
    const [newTicketBooking] = await TicketBookingModel.create(
      [
        {
          clientId: checkClientExists._id,
          bookingDate,
          departureFrom,
          destinationTo,
          departureDate,
          airlineName,
          flightNumber,
          seatClass,
          noOfPassengers,
          baseFare,
          taxesAndFees,
          totalAmount: totalFare,

          payments: initialPayments,

          bookedBy,
          issuedTicketNumber,
          remarks,
        },
      ],
      { session }
    );

    const newTicketBookingObj =
      newTicketBooking.toObject() as ITicketBookingDocument;

    await session.commitTransaction();

    return res.status(201).json({
      success: "New booking created successfully.",
      newTicketBooking: newTicketBookingObj,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Ticket Booking Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during ticket booking!" });
  } finally {
    session.endSession();
  }
};

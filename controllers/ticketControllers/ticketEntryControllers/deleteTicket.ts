import { Request, Response } from "express";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";
import { FundsLedger } from "../../../model/ticketModel/fundsLedgerModel";
import mongoose from "mongoose";
import { statfsSync } from "fs";

export const deleteTicket = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ticketBookingId = req.params.id;
    if (!ticketBookingId) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Booking Id not found." });
    }

    const checkTicketBooking = await TicketBookingModel.findById(
      ticketBookingId
    ).session(session);

    if (!checkTicketBooking) {
      await session.abortTransaction();
      return res.status(404).json({
        error: `Ticket booking with Id: ${ticketBookingId} not found.`,
      });
    }
    if (checkTicketBooking.paymentStatus === "paid") {
      await session.abortTransaction();
      return res
        .status(409)
        .json({ error: "You can not delete this ticket booking." });
    }

    const deleteTicketBooking = await TicketBookingModel.findOneAndDelete({
      _id: ticketBookingId,
    }).session(session);

    const updateFundsLedger = await FundsLedger.findOneAndUpdate(
      {
        airline: checkTicketBooking.airlineName,
      },
      {
        $inc: { balance: +checkTicketBooking.totalAmount },
      },
      { session }
    );

    await session.commitTransaction();
    return res
      .status(200)
      .json({ success: "Ticket booking deleted succefully." });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal server error!" });
  } finally {
    await session.endSession();
  }
};

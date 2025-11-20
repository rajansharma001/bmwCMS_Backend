import { Request, Response } from "express";
import { TicketBookingFundsTypes } from "../../../types/ticketBookingFundsTypes";
import mongoose from "mongoose";
import { TicketBookingFund } from "../../../model/ticketModel/ticketBookingFundModel";
import { FundsLedger } from "../../../model/ticketModel/fundsLedgerModel";
import { FundsLedgerTypes } from "../../../types/fundsLedgerTypes";

export const newFundEntry = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fundsFor, newFund } = req.body as TicketBookingFundsTypes;

    if (!fundsFor || typeof newFund !== "number") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "All fields are required." });
    }

    const [addNewFund] = await TicketBookingFund.create(
      [{ fundsFor, newFund, status: "completed" }],
      { session }
    );

    if (!addNewFund) {
      return res.status(400).json({ error: "New fund creation failed." });
    }

    const addFundsToLedger = await FundsLedger.findOneAndUpdate(
      {
        airline: fundsFor,
      },
      {
        $inc: { balance: newFund },
        $set: { airline: fundsFor },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();
    return res.status(201).json({
      success: "New fund added successfully.",
      addNewFund,
      addFundsToLedger: addFundsToLedger.toObject<FundsLedgerTypes>(),
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal server error!" });
  } finally {
    session.endSession();
  }
};

import { Request, Response } from "express";
import { TicketBookingFund } from "../../../model/ticketModel/ticketBookingFundModel";
import { FundsLedger } from "../../../model/ticketModel/fundsLedgerModel";
import mongoose from "mongoose";
import { FundsLedgerTypes } from "../../../types/fundsLedgerTypes";

export const reverseFund = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const fundId = req.params.id;
    if (!fundId) {
      return res.status(404).json({ error: "Requested fund not found." });
    }
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const checkFund = await TicketBookingFund.findById(fundId).session(session);
    if (!checkFund) {
      return res.status(404).json({ error: "Fund with given Id not found." });
    }

    console.log("Running 1");

    const airline = checkFund.fundsFor;
    console.log(airline);
    const checkFundsInLadger = await FundsLedger.findOne({ airline }).session(
      session
    );
    console.log("CheckFundsInLedger: ", checkFundsInLadger);
    if (!checkFundsInLadger) {
      return res
        .status(404)
        .json({ error: "With provided details airline not found in ladger." });
    }

    if (
      checkFund.status === "reversed-out" ||
      checkFund.status === "reversal-in"
    ) {
      return res.status(409).json({
        error: `Fund is already marked as ${checkFund.status}. Cannot reverse.`,
      });
    }

    const [addReverseFund] = await TicketBookingFund.create(
      [
        {
          fundsFor: airline,
          newFund: checkFund.newFund,
          status: "reversal-in",
          reveredFundId: fundId,
          description,
        },
      ],
      { session }
    );

    if (!addReverseFund) {
      return res.status(400).json({ error: "New fund creation failed." });
    }

    await TicketBookingFund.findByIdAndUpdate(
      fundId,
      {
        $set: { status: "reversed-out" },
      },
      { session }
    );

    const addReverseFundsToLedger = await FundsLedger.findOneAndUpdate(
      { airline },

      {
        $inc: { balance: -checkFund.newFund },
        $set: { airline },
      },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: "Fund successfully reversed.",
      addReverseFund,
      addReverseFundsToLedger:
        addReverseFundsToLedger.toObject<FundsLedgerTypes>(),
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal server error!" });
  } finally {
    session.endSession();
  }
};

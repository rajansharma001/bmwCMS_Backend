import { Request, Response } from "express";
import { FundsLedger } from "../../../model/ticketModel/fundsLedgerModel";

export const getFundsLedger = async (req: Request, res: Response) => {
  try {
    console.log("running");
    const getFundsLedgerTable = await FundsLedger.find();
    if (!getFundsLedgerTable || getFundsLedgerTable.length === 0) {
      return res.status(404).json({ error: "Funds Ledger not found." });
    }
    return res
      .status(200)
      .json({ success: "Funds fetched successfully.", getFundsLedgerTable });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

import { Request, Response } from "express";
import { TicketBookingFund } from "../../../model/ticketModel/ticketBookingFundModel";

export const getFunds = async (req: Request, res: Response) => {
  try {
    const getFunds = await TicketBookingFund.find().sort({ createdAt: -1 });
    if (getFunds.length <= 0) {
      return res.status(404).json({ error: "Funds not found." });
    }
    return res
      .status(200)
      .json({ success: "Funds fetched successfully.", getFunds });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getFundsById = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).json({ error: "Id not found" });
    }
    const getFundsById = await TicketBookingFund.findById(_id);
    if (!getFundsById) {
      return res.status(404).json({ error: "Fund not found." });
    }
    return res
      .status(200)
      .json({ success: "Funds fetched successfully.", getFundsById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

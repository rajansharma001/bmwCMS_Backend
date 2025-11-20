import { Request, Response } from "express";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";

export const viewTicketBookings = async (req: Request, res: Response) => {
  try {
    const getTicketBookings = await TicketBookingModel.find();
    if (!getTicketBookings) {
      return res.status(404).json({ error: "Ticket booking not found." });
    }
    return res.status(200).json({
      success: "Ticket booking fetched successfully.",
      getTicketBookings,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

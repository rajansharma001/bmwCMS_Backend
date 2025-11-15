import { Request, Response } from "express";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";

export const viewTicketBookingById = async (req: Request, res: Response) => {
  try {
    const ticketBookingId = req.params.id;
    if (!ticketBookingId) {
      return res.status(400).json({ message: "Ticket booking Id not found." });
    }

    const getTicketBookingById = await TicketBookingModel.findById(
      ticketBookingId
    );
    if (!getTicketBookingById) {
      return res.status(404).json({ message: "Ticket booking not found." });
    }

    return res.status(200).json({
      message: "Ticket booking by Id fetched successfully.",
      getTicketBookingById,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

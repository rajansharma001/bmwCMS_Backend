import { Request, Response } from "express";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticketBookingId = req.params.id;
    if (!ticketBookingId) {
      return res.status(400).json({ message: "Booking Id not found." });
    }

    const checkTicketBooking = await TicketBookingModel.findById(
      ticketBookingId
    );
    if (!checkTicketBooking) {
      return res.status(404).json({
        message: `Ticket booking with Id: ${ticketBookingId} not found.`,
      });
    }

    if (
      checkTicketBooking.status === "confirmed" ||
      checkTicketBooking.status === "completed"
    ) {
      return res
        .status(409)
        .json({ message: "You can not delete this ticket booking." });
    }

    const deleteTicketBooking = await TicketBookingModel.findOneAndDelete({
      _id: ticketBookingId,
    });

    return res
      .status(200)
      .json({ message: "Ticket booking deleted succefully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

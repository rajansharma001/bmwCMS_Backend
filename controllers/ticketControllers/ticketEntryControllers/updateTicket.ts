import { Request, Response } from "express";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const {
      clientId,
      bookingDate,
      departureFrom,
      destinationTo,
      departureDate,
      flightNumber,
      issuedTicketNumber,
      remarks,
    } = req.body;

    const ticketId = req.params.id;
    if (!ticketId) {
      return res.status(400).json({ error: "Booking Id not found." });
    }

    const checkTicketBooking = await TicketBookingModel.findById(ticketId);
    if (!checkTicketBooking) {
      return res.status(404).json({
        error: `Ticket booking with Id: ${ticketId} not found.`,
      });
    }

    if (checkTicketBooking.paymentStatus === "paid") {
      return res.status(400).json({
        error:
          "Ticket amount is already paid. You can not update paid booking.",
      });
    }

    const updateTicketDetails = await TicketBookingModel.findByIdAndUpdate(
      ticketId,
      {
        clientId,
        bookingDate,
        departureFrom,
        destinationTo,
        departureDate,
        flightNumber,
        issuedTicketNumber,
        remarks,
      }
    );

    if (!updateTicketDetails) {
      return res
        .status(400)
        .json({ error: "Problem while updating ticket details." });
    }

    return res
      .status(200)
      .json({ success: "Ticket details updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

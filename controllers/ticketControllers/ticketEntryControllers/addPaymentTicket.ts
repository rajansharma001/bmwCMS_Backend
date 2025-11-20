import { Request, Response } from "express";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";

interface AddPaymentRequest extends Request {
  body: {
    ticketId: string;
    amount: number;
    paymentMethod: string;
    date: string;
    description?: string;
  };
}

export const addPaymentToTicket = async (
  req: AddPaymentRequest,
  res: Response
) => {
  console.log("--- New Add Payment Request Received ---");
  console.log("Request Body:", req.body);

  try {
    const { ticketId, amount, paymentMethod, date, description } = req.body;

    if (!ticketId) {
      console.error("Validation Error: Missing Ticket ID.");
      return res
        .status(400)
        .json({ error: "Ticket ID is required from the request body." });
    }

    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      console.error(`Validation Error: Invalid payment amount '${amount}'.`);
      return res
        .status(400)
        .json({ error: "Invalid payment amount. Must be a positive number." });
    }

    if (!paymentMethod) {
      console.error("Validation Error: Missing Payment Method.");
      return res.status(400).json({ error: "Payment method is required." });
    }

    console.log(`Payload valid. Searching for Ticket ID: ${ticketId}`);

    const ticket = await TicketBookingModel.findById(ticketId);
    if (!ticket) {
      console.error(`Database Error: Trip ID ${ticketId} not found.`);
      return res.status(404).json({ error: "Ticket not found." });
    }

    console.log(
      `Ticket Found. Total Paid: ${ticket.totalPaidAmount}, Current Balance Due: ${ticket.balanceDue}`
    );

    if (ticket.balanceDue <= 0) {
      console.error(
        `Strict Payment Blocked: Balance is already Rs. ${ticket.balanceDue.toFixed(
          2
        )}. Cannot accept new payment.`
      );
      return res.status(400).json({
        error: `This Ticket is already fully paid or overpaid (Balance: Rs. ${ticket.balanceDue.toFixed(
          2
        )}). Cannot record new payments.`,
      });
    }

    if (paymentAmount > ticket.balanceDue) {
      console.error(
        `Strict Payment Blocked: Payment Rs. ${paymentAmount} exceeds the remaining balance Rs. ${ticket.balanceDue.toFixed(
          2
        )}.`
      );
      return res.status(400).json({
        error: `Payment amount Rs. ${paymentAmount} exceeds the remaining balance of Rs. ${ticket.balanceDue.toFixed(
          2
        )}. Please adjust the amount.`,
      });
    }

    console.log("Payment passed strict validation. Proceeding to record.");

    const newPaymentEntry = {
      amount: paymentAmount,
      paymentMethod: paymentMethod.toLowerCase() as any,
      date: new Date(date),
      description: description || "",
    };

    ticket.payments.push(newPaymentEntry as any);
    console.log("New Payment Entry added to array:", newPaymentEntry);

    const updatedTicket = await ticket.save();
    console.log("Ticket saved successfully.");

    console.log("--- Request Complete (Success) ---");
    return res.status(200).json({
      success: "Payment added successfully",
      ticket: updatedTicket,
    });
  } catch (error: any) {
    console.error("FATAL ERROR during addPaymentToTicket:", error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: `Validation failed: ${error.message}` });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

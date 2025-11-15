import { Request, Response } from "express";
import { TripModel, ITripDocument } from "../../../model/tripModel"; // Ensure ITripDocument is imported

// Update the type of req to include body data
interface AddPaymentRequest extends Request {
  body: {
    tripId: string;
    amount: number;
    paymentMethod: string; // Should match the enum in the model
    date: string; // Date string from frontend
    description?: string;
  };
}

export const addPaymentToTrip = async (
  req: AddPaymentRequest,
  res: Response
) => {
  // Console log the start of the request and the incoming payload
  console.log("--- New Add Payment Request Received ---");
  console.log("Request Body:", req.body);

  try {
    // 1. Get data from the request body
    const { tripId, amount, paymentMethod, date, description } = req.body;

    // --- 2. Initial Validation ---
    if (!tripId) {
      console.error("Validation Error: Missing Trip ID.");
      return res
        .status(400)
        .json({ error: "Trip ID is required from the request body." });
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

    console.log(`Payload valid. Searching for Trip ID: ${tripId}`);

    // --- 3. Find Trip ---
    const trip: ITripDocument | null = await TripModel.findById(tripId);
    if (!trip) {
      console.error(`Database Error: Trip ID ${tripId} not found.`);
      return res.status(404).json({ error: "Trip not found." });
    }

    // Log trip details before payment
    console.log(
      `Trip Found. Total Paid: ${trip.totalPaidAmount}, Current Balance Due: ${trip.balanceDue}`
    );

    // =========================================================================
    // 4. STRICT PAYMENT VALIDATION 🛑
    // =========================================================================

    // Check 1: If the balance is zero or negative, no more payments are allowed.
    if (trip.balanceDue <= 0) {
      console.error(
        `Strict Payment Blocked: Balance is already Rs. ${trip.balanceDue.toFixed(
          2
        )}. Cannot accept new payment.`
      );
      return res.status(400).json({
        error: `This trip is already fully paid or overpaid (Balance: Rs. ${trip.balanceDue.toFixed(
          2
        )}). Cannot record new payments.`,
      });
    }

    // Check 2: If the payment amount exceeds the remaining positive balance.
    if (paymentAmount > trip.balanceDue) {
      console.error(
        `Strict Payment Blocked: Payment Rs. ${paymentAmount} exceeds the remaining balance Rs. ${trip.balanceDue.toFixed(
          2
        )}.`
      );
      return res.status(400).json({
        error: `Payment amount Rs. ${paymentAmount} exceeds the remaining balance of Rs. ${trip.balanceDue.toFixed(
          2
        )}. Please adjust the amount.`,
      });
    }

    // =========================================================================

    console.log("Payment passed strict validation. Proceeding to record.");

    // --- 5. Add Payment Sub-Document ---
    const newPaymentEntry = {
      amount: paymentAmount,
      paymentMethod: paymentMethod.toLowerCase() as any,
      date: new Date(date),
      description: description || "",
    };

    trip.payments.push(newPaymentEntry as any);
    console.log("New Payment Entry added to array:", newPaymentEntry);

    // --- 6. Save Trip ---
    const updatedTrip = await trip.save();
    console.log("Trip saved successfully.");

    // --- 7. Respond ---
    console.log("--- Request Complete (Success) ---");
    return res.status(200).json({
      success: "Payment added successfully",
      trip: updatedTrip,
    });
  } catch (error: any) {
    // Log the detailed error
    console.error("FATAL ERROR during addPaymentToTrip:", error);

    // Check for Mongoose validation errors (e.g., enum failure)
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: `Validation failed: ${error.message}` });
    }
    // General internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
};

import mongoose, { Schema } from "mongoose";
import { ClientsModel } from "../quotationModel/clientsModel";

const TicketBookingSchema = new mongoose.Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    tripType: {
      type: String,
      enum: ["one-way", "round-trip", "multi-city"],
      required: true,
    },
    departureFrom: { type: String, required: true },
    destinationTo: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    airlineName: { type: String },
    flightNumber: { type: String },
    seatClass: {
      type: String,
      enum: ["Economy", "Business", "First"],
      default: "Economy",
    },
    noOfPassengers: { type: Number, required: true },
    baseFare: { type: Number, required: true },
    taxesAndFees: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "esewa", "bankTransfer", "credit"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    transactionId: { type: String },

    bookedBy: { type: String, required: true },
    issuedTicketNumber: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const TicketBookingModel = mongoose.model(
  "TicketBookingModel",
  TicketBookingSchema
);

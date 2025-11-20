import mongoose, { Schema, Document } from "mongoose";

// --- 1. Define Sub-document Interface (IPayment) ---
export interface IPayment {
  amount: number;
  paymentMethod: "cash" | "bank" | "esewa";
  transactionId?: string; // Move optional ID here
  date: Date;
}

// --- 2. Define Main Document Interface (ITicketBooking) ---
export interface ITicketBooking {
  clientId: mongoose.Schema.Types.ObjectId;
  bookingDate: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  tripType: "one-way" | "round-trip";
  departureFrom: string;
  destinationTo: string;
  departureDate: Date;
  returnDate?: Date; // Optional
  airlineName?: string; // Optional
  flightNumber?: string; // Optional
  seatClass: "Economy" | "Business" | "First";
  noOfPassengers: number;
  baseFare: number;
  taxesAndFees: number;
  totalAmount: number;
  currency: string;
  bookedBy: string;
  issuedTicketNumber?: string; // Optional
  remarks?: string; // Optional

  // The payments array replaces the individual payment fields
  payments: mongoose.Types.DocumentArray<IPayment & mongoose.Document>;
}

// --- 3. Define Document Interface with Virtuals (ITicketBookingDocument) ---
export interface ITicketBookingDocument extends ITicketBooking, Document {
  // Virtuals
  totalPaidAmount: number;
  balanceDue: number;
  paymentStatus: "pending" | "paid" | "partial" | "refunded";

  createdAt: Date;
  updatedAt: Date;
}

// --- 4. Define Payment Sub-Schema ---
const PaymentSchema = new Schema<IPayment & mongoose.Document>({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["cash", "esewa", "bank"],
  },
  transactionId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// --- 5. Define Main Ticket Booking Schema ---
const TicketBookingSchema = new Schema<ITicketBookingDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    departureFrom: { type: String, required: true },
    destinationTo: { type: String, required: true },
    departureDate: { type: Date, required: true },
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

    // Use the sub-schema for payments array
    payments: [PaymentSchema],

    bookedBy: { type: String, required: true },
    issuedTicketNumber: { type: String },
    remarks: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Crucial for sending virtuals in API response
    toObject: { virtuals: true }, // Crucial for virtuals to appear when converting to object
  }
);

// --- 6. Virtual Property Definitions ---

// Calculates the total amount paid across all payments
TicketBookingSchema.virtual("totalPaidAmount").get(function (
  this: ITicketBookingDocument
) {
  return this.payments.reduce((total, payment) => total + payment.amount, 0);
});

// Calculates the remaining balance due
TicketBookingSchema.virtual("balanceDue").get(function (
  this: ITicketBookingDocument
) {
  return this.totalAmount - this.totalPaidAmount;
});

// Determines the payment status based on total paid amount
TicketBookingSchema.virtual("paymentStatus").get(function (
  this: ITicketBookingDocument
) {
  if (this.totalPaidAmount <= 0) {
    return "pending";
  }
  // You might need a more complex check for "refunded" based on a separate reversal transaction
  // or a negative amount in the payments array, but for now, we'll follow the trip model logic:
  if (this.totalPaidAmount >= this.totalAmount) {
    return "paid"; // Use 'paid' instead of 'completed' since 'completed' is used for the booking status
  }
  return "partial";
});

export const TicketBookingModel = mongoose.model<ITicketBookingDocument>(
  "TicketBooking",
  TicketBookingSchema
);

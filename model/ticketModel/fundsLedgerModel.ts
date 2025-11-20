import mongoose from "mongoose";

const FundsLedgerSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    ticketBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketBooking",
      required: true,
    },
    ticketTotalAmount: {
      type: Number,
      required: true,
    },
    airline: {
      type: String,
      enum: ["buddha_air", "shree_air", "yeti_air", "nepal_air"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const FundsLedger = mongoose.model("FundsLedger", FundsLedgerSchema);

import mongoose from "mongoose";

const TicketBookingFundSchema = new mongoose.Schema(
  {
    fundsFor: {
      type: String,
      enum: ["buddha", "shree", "yeti", "nepalair"],
      required: true,
    },
    newFund: {
      type: Number,
      required: true,
      default: 0,
    },
    totalFund: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "reversed"],
      default: "reversed",
    },
    reveredFundId: {
      type: String,
    },
    availableFund: {
      type: Number,
      required: true,
      default: 0,
    },
    usedFund: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const TicketBookingFund = mongoose.model(
  "TicketBookingFund",
  TicketBookingFundSchema
);

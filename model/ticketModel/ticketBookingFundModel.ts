import mongoose from "mongoose";

const TicketBookingFundSchema = new mongoose.Schema(
  {
    fundsFor: {
      type: String,
      enum: ["buddha_air", "shree_air", "yeti_air", "nepal_air"],
      required: true,
    },
    newFund: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "reversal-in", "reversed-out"],
      default: "completed",
    },
    reveredFundId: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const TicketBookingFund = mongoose.model(
  "TicketBookingFund",
  TicketBookingFundSchema
);

import mongoose from "mongoose";

const paymentsSchema = new mongoose.Schema(
  {
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleQuotation",
      required: true,
    },
    totalAmount: { type: Number, required: true },
    pendingAmount: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    payment_person: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "online"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export const PaymentsModel = mongoose.model("Payments", paymentsSchema);

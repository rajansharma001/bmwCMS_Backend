import mongoose from "mongoose";

const vehicleQuotationSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientsModel",
    },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "cancelled", "rejected"],
      default: "draft",
    },
    termsAndConditions: { type: String, required: true },
  },
  { timestamps: true }
);
export const VehicleQuotationModel = mongoose.model(
  "VehicleQuotation",
  vehicleQuotationSchema
);

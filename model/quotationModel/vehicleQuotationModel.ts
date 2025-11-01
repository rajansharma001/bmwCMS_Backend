import mongoose from "mongoose";

const vehicleQuotationSchema = new mongoose.Schema(
  {
    quotationNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    clientName: { type: String, required: true },
    companyName: { type: String, default: null },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
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
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);
export const VehicleQuotationModel = mongoose.model(
  "VehicleQuotation",
  vehicleQuotationSchema
);

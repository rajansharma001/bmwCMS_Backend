import mongoose from "mongoose";

const vehicleQuotationTableSchema = new mongoose.Schema(
  {
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleQuotation",
    },
    vehicleType: { type: String, required: true },
    brandModel: { type: String, required: true },
    noOfDays: { type: Number, required: true },
    ratePerDay: { type: Number, required: true },
    total: { type: Number, required: true },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
  },

  { timestamps: true }
);
export const VehicleQuotationTableModel = mongoose.model(
  "VehicleQuotationTable",
  vehicleQuotationTableSchema
);

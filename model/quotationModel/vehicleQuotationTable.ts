import mongoose from "mongoose";

const vehicleQuotationTableSchema = new mongoose.Schema(
  {
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleQuotation",
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    noOfDays: { type: Number, required: true },
    ratePerDay: { type: Number, required: true },
    total: { type: Number, required: true },
  },

  { timestamps: true }
);
export const VehicleQuotationTableModel = mongoose.model(
  "VehicleQuotationTable",
  vehicleQuotationTableSchema
);

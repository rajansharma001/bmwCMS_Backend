import mongoose from "mongoose";

const maintananceSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    maintananceType: { type: String },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    cost: { type: Number, required: true },
    receipt: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);
export const MaintananceModel = mongoose.model(
  "Maintanance",
  maintananceSchema
);

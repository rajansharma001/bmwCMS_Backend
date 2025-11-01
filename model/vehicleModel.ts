import mongoose from "mongoose";

const vechileSchema = new mongoose.Schema(
  {
    v_model: { type: String, required: true },
    v_brand: { type: String, required: true },
    v_type: { type: String, required: true },
    v_number: { type: String, required: true, unique: true },
    last_service_date: { type: Date, required: true },
  },
  { timestamps: true }
);
export const Vehicle = mongoose.model("Vehicle", vechileSchema);

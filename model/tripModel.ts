import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    avgKM: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);
export const TripModel = mongoose.model("Trip", tripSchema);

import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    countNumber: {
      type: String,
      requried: true,
    },
    title: {
      type: String,
      requried: true,
    },
  },
  { timestamps: true }
);

export const CounterModel = mongoose.model("CounterModel", CounterSchema);

import mongoose from "mongoose";
const SliderSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    paragraph: {
      type: String,
      required: true,
      trim: true,
    },
    slideImg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SliderModel = mongoose.model("SliderModel", SliderSchema);

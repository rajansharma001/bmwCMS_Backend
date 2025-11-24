import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    paragraph: {
      type: String,
      required: true,
    },
    aboutImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AboutModel = mongoose.model("AboutModel", AboutSchema);

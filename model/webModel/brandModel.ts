import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  logo: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  subTitle: {
    type: String,
    trim: true,
  },
});

export const brandModel = mongoose.model("brandModel", BrandSchema);

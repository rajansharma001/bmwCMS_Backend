// models/packages.ts
import mongoose, { Schema, Document } from "mongoose";

export interface PackageItem {
  name: string;
  price: number;
  discountedPrice?: number;
  hasDiscount: boolean;
  priceUnit: string;
  billingCycle: string;
  features: string[];
  isFeatured: boolean;
  callToAction: string;
  imageUrl?: string;
  specialOfferTitle?: string;
  specialOfferDetails?: string;
  hasSpecialOffer: boolean;
  _id?: string;
}

export interface PackagesSectionDocument extends Document {
  heading: string;
  title: string;
  shortDescription: string;
  packages: PackageItem[];
}

const PackageItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, required: false, min: 0 },
    hasDiscount: { type: Boolean, required: true, default: false },
    priceUnit: { type: String, required: true, trim: true, default: "$" },
    billingCycle: {
      type: String,
      required: true,
      trim: true,
      default: "per month",
    },
    features: { type: [String], required: true, default: [] },
    isFeatured: { type: Boolean, required: true, default: false },
    callToAction: { type: String, required: true, default: "Get Started" },
    imageUrl: { type: String, required: false, trim: true },
    specialOfferTitle: { type: String, required: false, trim: true },
    specialOfferDetails: { type: String, required: false, trim: true },
    hasSpecialOffer: { type: Boolean, required: true, default: false },
  },
  { _id: true }
);

const PackagesSectionSchema: Schema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    packages: {
      type: [PackageItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const PackagesSectionModel = mongoose.model<PackagesSectionDocument>(
  "PackagesSection",
  PackagesSectionSchema,
  "packagessections"
);

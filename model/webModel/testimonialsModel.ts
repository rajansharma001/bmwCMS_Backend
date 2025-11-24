import mongoose, { Schema, Document } from "mongoose";

export interface ReviewItem {
  star: number;
  name: string;
  post: string;
  brand: string;
  location?: string;
  reviewText: string;
  _id?: string;
}

export interface TestimonialPageSectionDocument extends Document {
  heading: string;
  title: string;
  shortDescription: string;
  reviews: ReviewItem[];
}

const ReviewItemSchema: Schema = new Schema(
  {
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    name: { type: String, required: true, trim: true },
    post: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    location: { type: String, required: false, trim: true },
    reviewText: { type: String, required: true },
  },
  { _id: true }
);

const TestimonialPageSectionSchema: Schema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    reviews: {
      type: [ReviewItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const TestimonialPageSectionModel =
  mongoose.model<TestimonialPageSectionDocument>(
    "TestimonialPageSectionModel",
    TestimonialPageSectionSchema,
    "testimonialsections"
  );

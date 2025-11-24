import mongoose, { Schema, Document } from "mongoose";

// --- FAQ Item Interface ---
/**
 * Defines the structure for a single Question and Answer pair (the subdocument).
 */
export interface FAQItem {
  question: string;
  answer: string;
}

// --- Page Section Document Interface ---
/**
 * Defines the overall document structure for the FAQ Page Section,
 * combining static metadata with the dynamic list of FAQs.
 */
export interface FAQPageSectionDocument extends Document {
  heading: string;
  title: string;
  shortDescription: string; // The introductory text for the FAQ section
  faqs: FAQItem[];
}

// 1. Define the Schema for a single FAQ Item (subdocument)
const FAQItemSchema: Schema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
  },
  { _id: true }
);

// 2. Define the main Page Section Schema
const FAQPageSectionSchema: Schema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    faqs: {
      type: [FAQItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 3. Create and Export the Mongoose Model
export const FAQPageSectionModel = mongoose.model<FAQPageSectionDocument>(
  "FAQPageSectionModel",
  FAQPageSectionSchema,
  "faqsections"
);

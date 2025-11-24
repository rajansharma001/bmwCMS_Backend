import mongoose, { Schema, Document } from "mongoose";

// Each gallery item
interface GalleryItem {
  image: string; // URL or file path
  caption?: string; // optional caption for the image
}

export interface GalleryDocument extends Document {
  heading: string;
  title: string;
  shortDescription: string;
  gallery: GalleryItem[];
}

const GalleryItemSchema: Schema = new Schema({
  image: { type: String, required: true },
  caption: { type: String, required: false },
});

const GallerySchema: Schema = new Schema({
  heading: { type: String, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  gallery: { type: [GalleryItemSchema], required: true },
});

export const GalleryModel = mongoose.model<GalleryDocument>(
  "GalleryModel",
  GallerySchema
);

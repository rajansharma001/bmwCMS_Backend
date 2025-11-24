import mongoose, { Schema } from "mongoose";

interface Item {
  icon: string;
  title: string;
  paragraph: string;
}

export interface WhyChooseUsDocument extends Document {
  heading: string;
  title: string;
  shortDescription: string;
  image: string;
  items: Item[];
}

const ItemSchema: Schema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  paragraph: { type: String, required: true },
});

const WhyChooseUsSchema: Schema = new Schema({
  heading: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  shortDescription: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
});

export const WhyChooseUsModel = mongoose.model<WhyChooseUsDocument>(
  "WhyChooseUsModel",
  WhyChooseUsSchema
);

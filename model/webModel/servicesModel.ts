import mongoose, { Schema, Document } from "mongoose";

interface Item {
  icon: string;
  title: string;
  paragraph: string;
  link: string;
}

export interface ServicesDocument extends Document {
  heading: string;
  title: string;
  shortDescription: string;
  items: Item[];
}

const ItemSchema: Schema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  paragraph: { type: String, required: true },
  link: { type: String, required: true },
});

const ServivcesSchema: Schema = new Schema({
  heading: { type: String, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
});

export const ServicesModel = mongoose.model<ServicesDocument>(
  "ServicesModel",
  ServivcesSchema
);

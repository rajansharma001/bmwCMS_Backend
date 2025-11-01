import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String, default: null },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);
export const ClientsModel = mongoose.model("Clients", clientsSchema);

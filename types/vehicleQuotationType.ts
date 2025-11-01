import { Types } from "mongoose";

export interface VehicleQuotationType {
  _id?: Types.ObjectId | string;
  quotationNumber: string;
  date: Date;
  clientName: string;
  companyName?: string | null;
  address: string;
  contactNumber: string;
  email: string;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "cancelled";
  termsAndConditions: string;
  createdBy: string;
  creatredAt: Date;
  updatedAt: Date;
}

// In your tripModel.ts file

import mongoose, { Schema, Document } from "mongoose";

interface IPayment {
  amount: number;
  paymentMethod: "none" | "cash" | "bank" | "esewa";
  date: Date;
}

export interface ITrip {
  vehicleId: mongoose.Schema.Types.ObjectId;
  clientId: mongoose.Schema.Types.ObjectId;
  startLocation: string;
  endLocation: string;
  avgKM: number;
  ratePerDay: number;
  noOfDays: number;
  startKM: number;
  endKM: number;
  terms?: string;
  totalAmount: number;
  // The payments array holds documents based on IPayment
  payments: mongoose.Types.DocumentArray<IPayment & mongoose.Document>;
}

export interface ITripDocument extends ITrip, Document {
  totalPaidAmount: number;
  balanceDue: number;
  paymentStatus: "pending" | "completed" | "partial";

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment & mongoose.Document>({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["none", "cash", "bank", "esewa"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Define the main TripSchema with the correct generic type
const TripSchema = new Schema<ITripDocument>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    avgKM: { type: Number, default: 0 },
    ratePerDay: { type: Number, required: true },
    noOfDays: { type: Number, required: true },
    startKM: { type: Number, default: 0 },
    endKM: { type: Number, default: 0 },
    terms: { type: String },
    totalAmount: {
      type: Number,
      required: true,
    },
    payments: [PaymentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TripSchema.virtual("totalPaidAmount").get(function (this: ITripDocument) {
  // Ensure the sum is a number
  return this.payments.reduce((total, payment) => total + payment.amount, 0);
});

TripSchema.virtual("balanceDue").get(function (this: ITripDocument) {
  return this.totalAmount - this.totalPaidAmount;
});

TripSchema.virtual("paymentStatus").get(function (this: ITripDocument) {
  if (this.totalPaidAmount <= 0) {
    return "pending";
  }
  if (this.totalPaidAmount >= this.totalAmount) {
    return "completed";
  }
  return "partial";
});

export const TripModel = mongoose.model<ITripDocument>("Trip", TripSchema);

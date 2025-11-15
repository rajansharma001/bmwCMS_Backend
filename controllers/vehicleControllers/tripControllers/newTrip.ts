import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";
import { Vehicle } from "../../../model/vehicleModel";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
export const newTrip = async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      clientId,
      startLocation,
      endLocation,
      ratePerDay,
      noOfDays,
      paidAmount,
      paymentMethod,
    } = req.body.formData;

    if (!ratePerDay || ratePerDay <= 0) {
      return res
        .status(400)
        .json({ error: "Rate per day must be greater than 0." });
    }

    if (!noOfDays || noOfDays <= 0) {
      return res
        .status(400)
        .json({ error: "Number of days must be greater than 0." });
    }
    const checkVehicleExsist = await Vehicle.findById(vehicleId);
    if (!checkVehicleExsist) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    const checkClientExsist = await ClientsModel.findById(clientId);
    if (!checkClientExsist) {
      return res.status(404).json({ error: "Client not found." });
    }

    const totalTripAmount = Number(ratePerDay) * Number(noOfDays);
    const initialPaidAmount = Number(paidAmount) || 0;

    if (initialPaidAmount > totalTripAmount) {
      return res.status(400).json({
        error: "Initial paid amount cannot be greater than total.",
      });
    }
    if (initialPaidAmount > 0 && (!paymentMethod || paymentMethod === "none")) {
      return res
        .status(400)
        .json({ error: "Payment method is required for initial payment." });
    }

    const initialPayments = [];
    if (initialPaidAmount > 0) {
      initialPayments.push({
        amount: initialPaidAmount,
        paymentMethod: paymentMethod,
        date: new Date(),
      });
    }

    const newTrip = await TripModel.create({
      vehicleId,
      clientId,
      startLocation,
      endLocation,
      avgKM: Number(req.body.formData.avgKM),
      ratePerDay: Number(ratePerDay),
      noOfDays: Number(noOfDays),
      totalAmount: totalTripAmount,
      startKM: Number(req.body.formData.startKM),
      endKM: Number(req.body.formData.endKM),
      terms: req.body.formData.terms,
      payments: initialPayments,
    });

    return res
      .status(201)
      .json({ success: "New trip created successfully", newTrip });
  } catch (error: any) {
    console.error("Error creating trip:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

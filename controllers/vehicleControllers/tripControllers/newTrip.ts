import express from "express";
import { TripModel } from "../../../model/tripModel";

export const newTrip = async (req: express.Request, res: express.Response) => {
  try {
    const {
      vehicleId,
      startLocation,
      endLocation,
      avgKM,
      totalAmount,
      startTime,
      endTime,
    } = req.body;
    if (
      !vehicleId ||
      !startLocation ||
      !endLocation ||
      !avgKM ||
      !totalAmount ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTrip = await TripModel.create({
      vehicleId,
      startLocation,
      endLocation,
      avgKM,
      totalAmount,
      startTime,
      endTime,
    });

    if (!newTrip) {
      return res.status(500).json({ message: "Failed to create new trip" });
    }
    return res
      .status(201)
      .json({ message: "New trip created successfully", newTrip });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

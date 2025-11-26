import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";

export const viewTrip = async (req: Request, res: Response) => {
  try {
    const getTrips = await TripModel.find();
    if (!getTrips) {
      return res.status(404).json({ error: "No trips found" });
    }
    return res
      .status(200)
      .json({ success: "Trips fetched successfully", getTrips });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

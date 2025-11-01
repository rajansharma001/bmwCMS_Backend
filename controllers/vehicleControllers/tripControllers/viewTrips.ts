import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const getTrips = await TripModel.find();
    if (!getTrips) {
      return res.status(404).json({ message: "No trips found" });
    }
    return res
      .status(200)
      .json({ message: "Trips fetched successfully", getTrips });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

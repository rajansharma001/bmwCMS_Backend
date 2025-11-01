import { Request, Response } from "express";
import { TripModel } from "../../model/tripModel";

export const viewTripById = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({ message: "Trip ID is required" });
    }
    const trip = await TripModel.findById(_id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(200).json({ message: "Trip fetched successfully", trip });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";

export const viewTripById = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({ error: "Trip ID is required" });
    }
    const tripById = await TripModel.findById(_id);
    if (!tripById) {
      return res.status(404).json({ error: "Trip not found" });
    }
    return res
      .status(200)
      .json({ success: "Trip fetched successfully", tripById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

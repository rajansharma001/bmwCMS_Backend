import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({ error: "Trip ID is required" });
    }
    const deletedTrip = await TripModel.findByIdAndDelete(_id);
    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    return res.status(200).json({ success: "Trip deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

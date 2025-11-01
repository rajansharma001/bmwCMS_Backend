import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const {
      vehicleId,
      startLocation,
      endLocation,
      avgKM,
      totalAmount,
      startTime,
      endTime,
    } = req.body;

    const checkTrip = await TripModel.findById(_id);
    if (!checkTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const updatedTrip = await TripModel.findByIdAndUpdate(
      _id,
      {
        vehicleId: vehicleId || checkTrip.vehicleId,
        startLocation: startLocation || checkTrip.startLocation,
        endLocation: endLocation || checkTrip.endLocation,
        avgKM: avgKM || checkTrip.avgKM,
        totalAmount: totalAmount || checkTrip.totalAmount,
        startTime: startTime || checkTrip.startTime,
        endTime: endTime || checkTrip.endTime,
      },
      { new: true }
    );
    if (!updatedTrip) {
      return res
        .status(404)
        .json({ message: "Trip updation failed. Please try again." });
    }
    return res
      .status(200)
      .json({ message: "Trip updated successfully", updatedTrip });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { Request, Response } from "express";
import { Vehicle } from "../../model/vehicleModel";

export const viewVehicle = async (req: Request, res: Response) => {
  try {
    const getVehicle = await Vehicle.find({});
    if (!getVehicle) {
      return res.status(404).json({ error: "No vehicles found." });
    }

    return res
      .status(200)
      .json({ message: "View vehicle endpoint working.", getVehicle });
  } catch (error) {
    console.log("Error in viewing vehicle:", error);
    return res.status(500).json({ error: "Bad Request for viewing vehicle." });
  }
};

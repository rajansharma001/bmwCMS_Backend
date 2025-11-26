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
      .json({ error: "View vehicle endpoint working.", getVehicle });
  } catch (error) {
    console.log("Error in viewing vehicle:", error);
    return res.status(500).json({ error: "Bad Request for viewing vehicle." });
  }
};

export const viewVehicleById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    console.log("ID", _id);
    if (!_id) {
      return res.status(404).json({ error: "Vehicle Id not found." });
    }
    const getVehicleById = await Vehicle.findById(_id);
    if (!getVehicleById) {
      return res.status(404).json({ error: "No vehicles found." });
    }

    console.log("2nd running");
    return res
      .status(200)
      .json({ success: "View vehicle endpoint working.", getVehicleById });
  } catch (error) {
    console.log("Error in viewing vehicle:", error);
    return res.status(500).json({ error: "Bad Request for viewing vehicle." });
  }
};

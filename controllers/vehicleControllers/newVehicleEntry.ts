import { Request, Response } from "express";
import { VehicleType } from "../../types/vehicleTypes";
import { Vehicle } from "../../model/vehicleModel";

export const newVehicleEntry = async (req: Request, res: Response) => {
  try {
    const { v_model, v_brand, v_type, v_number, last_service_date } =
      req.body as VehicleType;

    if (!v_model || !v_brand || !v_type || !v_number || !last_service_date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const checkVehicle = await Vehicle.findOne({ v_number });
    if (checkVehicle) {
      return res
        .status(409)
        .json({ error: `Vehicle with number ${v_number} already exists.` });
    }

    const newVehicle = await Vehicle.create({
      v_model,
      v_brand,
      v_type,
      v_number,
      last_service_date,
    });

    if (!newVehicle) {
      return res
        .status(500)
        .json({ error: "Failed to create new vehicle entry." });
    }

    return res
      .status(200)
      .json({ message: "New vehicle entry created successfully." });
  } catch (error) {
    console.log("Error in new vehicle entry:", error);
    return res
      .status(500)
      .json({ error: "Bad Request for new vehicle entry." });
  }
};

import { Request, Response } from "express";
import { VehicleType } from "../../types/vehicleTypes";
import { Vehicle } from "../../model/vehicleModel";

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(400).json({ error: "Vehicle Id is required." });
    }

    const { v_model, v_brand, v_type, v_number, last_service_date } =
      req.body as VehicleType;

    const checkVehicle = await Vehicle.findOne({ _id });
    if (!checkVehicle) {
      return res
        .status(404)
        .json({ error: `Vehicle with Id ${_id} not found.` });
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id },
      {
        v_model: v_model || checkVehicle.v_model,
        v_brand: v_brand || checkVehicle.v_brand,
        v_type: v_type || checkVehicle.v_type,
        v_number: v_number || checkVehicle.v_number,
        last_service_date: last_service_date || checkVehicle.last_service_date,
      }
    );
    if (!updatedVehicle) {
      return res
        .status(500)
        .json({ error: "Failed to update vehicle information." });
    }

    return res.status(200).json({ message: "Vehicle updated successfully." });
  } catch (error) {
    console.log("Error in updating vehicle:", error);
    return res.status(500).json({ error: "Bad Request for updating vehicle." });
  }
};

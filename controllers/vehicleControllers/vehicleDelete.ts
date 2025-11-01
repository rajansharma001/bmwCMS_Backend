import { Request, Response } from "express";
import { Vehicle } from "../../model/vehicleModel";

export const vehicleDelete = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({ error: "Vehicle number is required." });
    }
    const deletedVehicle = await Vehicle.findOneAndDelete({ _id });
    if (!deletedVehicle) {
      return res
        .status(404)
        .json({ error: `Vehicle with Id ${_id} not found.` });
    }

    return res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    console.log("Error in vehicle deletion:", error);
    return res.status(500).json({ error: "Bad Request for vehicle deletion." });
  }
};

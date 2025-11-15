import { Request, Response } from "express";
import { Vehicle } from "../../model/vehicleModel";
import { VehicleQuotationModel } from "../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../model/quotationModel/vehicleQuotationTable";

export const vehicleDelete = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({ error: "Vehicle number is required." });
    }

    const checkAttachedTable = await VehicleQuotationTableModel.findOne({
      vehicleId: _id,
    });
    if (checkAttachedTable) {
      return res.status(400).json({
        error: `Vehicle with Id ${_id} is attached with an quotation. You can not delete this now.`,
      });
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

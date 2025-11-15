import { Request, Response } from "express";
import { MaintananceModel } from "../../../model/maintananceModel";

export const deleteMainananceRecord = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;

    console.log(`running 1`);
    if (!_id) {
      return res
        .status(400)
        .json({ message: "Maintenance record ID is required" });
    }
    const deletedRecord = await MaintananceModel.findByIdAndDelete(_id);
    console.log(`running 2`);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }
    console.log(`running 3`);

    return res
      .status(200)
      .json({ message: "Maintenance record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

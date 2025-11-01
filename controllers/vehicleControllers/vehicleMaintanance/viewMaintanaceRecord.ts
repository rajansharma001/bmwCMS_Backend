import { Request, Response } from "express";
import { MaintananceModel } from "../../../model/maintananceModel";

export const viewMaintanaceRecord = async (req: Request, res: Response) => {
  try {
    const getMaintananceRecord = await MaintananceModel.find();
    if (!getMaintananceRecord) {
      return res.status(404).json({ message: "No maintenance records found" });
    }
    return res.status(200).json({
      message: "Maintenance records fetched successfully",
      getMaintananceRecord,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

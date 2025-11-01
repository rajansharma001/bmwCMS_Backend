import { Request, Response } from "express";
import { MaintananceModel } from "../../../model/maintananceModel";

export const newMaintananceRecord = async (req: Request, res: Response) => {
  try {
    const { vehicleId, description, date, cost } = req.body;
    if (!vehicleId || !description || !date || !cost) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const file = req.file;
    let receiptUrl = file?.path || "";

    const newRecord = await MaintananceModel.create({
      vehicleId,
      description,
      date,
      cost,
      receipt: receiptUrl,
    });

    if (!newRecord) {
      return res.status(500).json({ message: "Failed to create new record" });
    }
    return res.status(201).json({
      message: "New maintenance record created successfully",
      newRecord,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

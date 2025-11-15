import { Request, Response } from "express";
import { MaintananceModel } from "../../../model/maintananceModel";

export const newMaintananceRecord = async (req: Request, res: Response) => {
  try {
    console.log("running 1");
    const { vehicleId, description, date, cost } = req.body;
    if (!vehicleId || !description || !date || !cost) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("running 2");
    const file = req.file;
    let receiptUrl = file?.path || "";
    console.log("running 3");
    console.log(receiptUrl);
    console.log(req.body);
    const newRecord = await MaintananceModel.create({
      vehicleId,
      description,
      date,
      cost,
      receipt: receiptUrl,
    });
    console.log("running 4");
    if (!newRecord) {
      return res.status(500).json({ message: "Failed to create new record" });
    }
    console.log("running 5");
    return res.status(201).json({
      message: "New maintenance record created successfully",
      newRecord,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

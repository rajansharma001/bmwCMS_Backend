import { Request, Response } from "express";
import { MaintananceModel } from "../../../model/maintananceModel";

export const updateMaintananceRecord = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).json({ message: "Maintenance Id not found" });
    }
    console.log("main-update runnging: 1");
    const { vehicleId, maintananceType, description, cost, date } = req.body;
    console.log(req.body);
    const checkRecord = await MaintananceModel.findById(_id);
    if (!checkRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }
    console.log("main-update runnging: 2");

    const file = req.file;
    let receiptUrl = file?.path || "";
    console.log("main-update runnging: 3");

    const updatedRecord = await MaintananceModel.findByIdAndUpdate(
      _id,
      {
        vehicleId: vehicleId || checkRecord.vehicleId,
        maintananceType: maintananceType || checkRecord.maintananceType,
        description: description || checkRecord.description,
        cost: cost || checkRecord.cost,
        date: date || checkRecord.date,
        receipt: receiptUrl || checkRecord.receipt,
      },
      { new: true }
    );
    console.log("main-update runnging: 4");

    if (!updatedRecord) {
      return res.status(404).json({
        message: "Maintenance record updation failed. Please try again.",
      });
    }
    console.log("main-update runnging: 5");

    return res.status(200).json({
      message: "Maintenance record updated successfully",
      updatedRecord,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

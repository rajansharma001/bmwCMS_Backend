import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";
import mongoose from "mongoose";

export const deleteQuotation = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).json({ error: "Quotation Id not found." });
    }

    const getQuotationDetails = await VehicleQuotationModel.findById(_id);
    if (!getQuotationDetails) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Quotation not found." });
    }
    if (
      getQuotationDetails.status === "accepted" ||
      getQuotationDetails.status === "sent"
    ) {
      return res
        .status(409)
        .json({ error: "You can not delete a processed quotation." });
    }
    // Delete related quotation tables first
    await VehicleQuotationTableModel.deleteMany({ quotationId: _id }).session(
      session
    );

    const deleteQuotation = await VehicleQuotationModel.findByIdAndDelete(
      _id
    ).session(session);
    if (!deleteQuotation) {
      await session.abortTransaction();
      return res.status(409).json({ error: "Quotation deletion error." });
    }
    await session.commitTransaction();

    return res.status(200).json({ success: "Quotation deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

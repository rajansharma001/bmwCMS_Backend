import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";

export const viewQuotationTable = async (req: Request, res: Response) => {
  try {
    const getQuotationTable = await VehicleQuotationTableModel.find();
    if (getQuotationTable.length <= 0) {
      return res.status(409).json({ error: "Quotation table not found." });
    }
    return res
      .status(200)
      .json({ success: "Quotation fetched successfully.", getQuotationTable });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

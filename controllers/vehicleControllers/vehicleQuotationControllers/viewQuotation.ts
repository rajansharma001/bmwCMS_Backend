import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";

export const viewQuotation = async (req: Request, res: Response) => {
  try {
    const getQuotation = await VehicleQuotationModel.find();
    if (getQuotation.length <= 0) {
      return res.status(409).json({ message: "Quotation not found." });
    }
    return res
      .status(200)
      .json({ message: "Quotation fetched successfully.", getQuotation });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";

export const viewQuotationById = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).json({ message: "Quotation Id not found." });
    }
    const getQuotationById = await VehicleQuotationModel.findByIdAndDelete(_id);
    if (!getQuotationById) {
      return res.status(409).json({ message: "Quotation fetching error." });
    }
    return res
      .status(200)
      .json({ message: "Quotation fetched successfully.", getQuotationById });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

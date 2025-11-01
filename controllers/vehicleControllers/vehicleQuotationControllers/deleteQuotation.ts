import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";

export const deleteQuotation = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).json({ message: "Quotation Id not found." });
    }

    const getQuotationDetails = await VehicleQuotationModel.findById(_id);
    if (!getQuotationDetails) {
      return res.status(404).json({ message: "Quotation not found." });
    }
    if (getQuotationDetails.status !== "accepted" || "sent") {
      return res
        .status(409)
        .json({ message: "You can not delete a processed quotation." });
    }
    const deleteQuotation = await VehicleQuotationModel.findByIdAndDelete(_id);
    if (!deleteQuotation) {
      return res.status(409).json({ message: "Quotation deletion error." });
    }
    return res.status(200).json({ message: "Quotation deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

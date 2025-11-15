import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";

// GET /api/quotations/get-quotation/:id
export const viewQuotationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quotation = await VehicleQuotationModel.findById(id).lean();
    if (!quotation)
      return res.status(404).json({ error: "Quotation not found" });

    // fetch related table rows
    const quotationTables = await VehicleQuotationTableModel.find({
      quotationId: id,
    }).lean();

    return res.status(200).json({
      success: true,
      getQuotationById: quotation,
      getQuotationTableById: quotationTables,
    });
  } catch (error) {
    console.error("Error fetching quotation by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

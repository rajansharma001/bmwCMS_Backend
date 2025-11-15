import { Router } from "express";
import { newQuotation } from "../controllers/vehicleControllers/vehicleQuotationControllers/newQuotation";
import { viewQuotation } from "../controllers/vehicleControllers/vehicleQuotationControllers/viewQuotation";
import { viewQuotationById } from "../controllers/vehicleControllers/vehicleQuotationControllers/viewQuotationById";
import { updateQuotation } from "../controllers/vehicleControllers/vehicleQuotationControllers/updateQuotation";
import { deleteQuotation } from "../controllers/vehicleControllers/vehicleQuotationControllers/deleteQuotation";
import { viewQuotationTable } from "../controllers/vehicleControllers/vehicleQuotationControllers/viewQuotationTable";

export const quotationRoutes = Router();

quotationRoutes.post("/new-quotation", newQuotation);
quotationRoutes.get("/get-quotation", viewQuotation);
quotationRoutes.get("/get-quotation/:id", viewQuotationById);
quotationRoutes.patch("/update-quotation/:id", updateQuotation);
quotationRoutes.delete("/delete-quotation/:id", deleteQuotation);

// quotation table

quotationRoutes.get("/get-quotation-table", viewQuotationTable);

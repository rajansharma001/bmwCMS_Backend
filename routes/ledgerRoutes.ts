import { Router } from "express";
import { getFundsLedger } from "../controllers/ticketControllers/fundsForTicket/getFundsLedger";

export const ledgerRoutes = Router();
ledgerRoutes.get("/get-ledger", getFundsLedger);

ledgerRoutes.use((req, res, next) => {
  console.log("Ledger route hit:", req.method, req.url);
  next();
});

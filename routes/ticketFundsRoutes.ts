import { Router } from "express";
import { newFundEntry } from "../controllers/ticketControllers/fundsForTicket/newFundEntry";
import { reverseFund } from "../controllers/ticketControllers/fundsForTicket/reverseFund";
import {
  getFunds,
  getFundsById,
} from "../controllers/ticketControllers/fundsForTicket/getFunds";

export const ticketFundsRoute = Router();

ticketFundsRoute.post("/new-fund", newFundEntry);
ticketFundsRoute.post("/reverse-fund/:id", reverseFund);
ticketFundsRoute.get("/get-fund", getFunds);
ticketFundsRoute.get("/get-fund/:id", getFundsById);

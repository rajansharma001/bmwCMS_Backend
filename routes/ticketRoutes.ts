import { Router } from "express";
import { newTicket } from "../controllers/ticketControllers/ticketEntryControllers/newTicket";
import { viewTicketBookings } from "../controllers/ticketControllers/ticketEntryControllers/viewTicketBookings";
import { viewTicketBookingById } from "../controllers/ticketControllers/ticketEntryControllers/viewTicketBookingById";
import { updateTicket } from "../controllers/ticketControllers/ticketEntryControllers/updateTicket";
import { deleteTicket } from "../controllers/ticketControllers/ticketEntryControllers/deleteTicket";
import { addPaymentToTicket } from "../controllers/ticketControllers/ticketEntryControllers/addPaymentTicket";

export const ticketRoutes = Router();

ticketRoutes.post("/new-ticket", newTicket);
ticketRoutes.get("/get-ticket", viewTicketBookings);
ticketRoutes.get("/get-ticket/:id", viewTicketBookingById);
ticketRoutes.patch("/update-ticket/:id", updateTicket);
ticketRoutes.delete("/delete-ticket/:id", deleteTicket);
ticketRoutes.post("/add-payment/:id", addPaymentToTicket);

import { Router } from "express";
import { newClient } from "../controllers/clientControllers/newClient";
import {
  getClients,
  getClientsById,
} from "../controllers/clientControllers/viewClient";
import { deleteClient } from "../controllers/clientControllers/deleteClient";
import { updateClient } from "../controllers/clientControllers/updateClient";

export const clientRoutes = Router();

clientRoutes.post("/new-client", newClient);
clientRoutes.get("/get-client", getClients);
clientRoutes.get("/get-client/:id", getClientsById);
clientRoutes.delete("/delete-client/:id", deleteClient);
clientRoutes.patch("/update-client/:id", updateClient);

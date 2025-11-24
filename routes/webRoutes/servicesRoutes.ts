import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getServices,
  getServicesById,
  newServices,
  updateServices,
} from "../../controllers/webControllers/manageServices";

export const servicesRoutes = Router();

servicesRoutes.post("/new-service", newServices);
servicesRoutes.get("/get-service", getServices);
servicesRoutes.get("/get-service/:id", getServicesById);
servicesRoutes.patch("/update-service/:id", verifyToken, updateServices);

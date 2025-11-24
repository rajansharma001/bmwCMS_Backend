import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getCounter,
  getCounterById,
  newCounter,
  updateCounter,
} from "../../controllers/webControllers/manageCounter";

export const counterRoutes = Router();

counterRoutes.post("/new-counter", verifyToken, newCounter);
counterRoutes.get("/get-counter/:id", verifyToken, getCounterById);
counterRoutes.patch("/update-counter/:id", verifyToken, updateCounter);
counterRoutes.get("/get-counter", getCounter);

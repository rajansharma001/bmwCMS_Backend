import { Router } from "express";
import { newVehicleEntry } from "../controllers/vehicleControllers/newVehicleEntry";
import { verifyToken } from "../middleware/verifyToken";
import { vehicleDelete } from "../controllers/vehicleControllers/vehicleDelete";
import { updateVehicle } from "../controllers/vehicleControllers/updateVehicle";
import {
  viewVehicle,
  viewVehicleById,
} from "../controllers/vehicleControllers/viewVehicle";

export const vehicleRouter = Router();

vehicleRouter.post("/new-vehicle", newVehicleEntry);
vehicleRouter.delete("/delete-vehicle/:_id", vehicleDelete);
vehicleRouter.patch("/update-vehicle/:_id", updateVehicle);
vehicleRouter.get("/get-vehicle/:_id", viewVehicleById);

vehicleRouter.get("/get-vehicles", viewVehicle);

import { Router } from "express";
import { newVehicleEntry } from "../controllers/vehicleControllers/newVehicleEntry";
import { verifyToken } from "../middleware/verifyToken";
import { vehicleDelete } from "../controllers/vehicleControllers/vehicleDelete";
import { updateVehicle } from "../controllers/vehicleControllers/updateVehicle";
import { viewVehicle } from "../controllers/vehicleControllers/viewVehicle";

export const vehicleRouter = Router();

vehicleRouter.post("/new-vehicle", verifyToken, newVehicleEntry);
vehicleRouter.delete("/delete-vehicle/:_id", verifyToken, vehicleDelete);
vehicleRouter.patch("/update-vehicle/:_id", verifyToken, updateVehicle);
vehicleRouter.get("/get-vehicles", verifyToken, viewVehicle);

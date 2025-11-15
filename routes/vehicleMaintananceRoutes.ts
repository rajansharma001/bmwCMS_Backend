import { Router } from "express";
import { viewMaintanaceRecord } from "../controllers/vehicleControllers/vehicleMaintanance/viewMaintanaceRecord";
import { viewMaintanaceRecordById } from "../controllers/vehicleControllers/vehicleMaintanance/viewMaintanceRecordById";
import { deleteMainananceRecord } from "../controllers/vehicleControllers/vehicleMaintanance/deleteMaintananceRecord";
import { updateMaintananceRecord } from "../controllers/vehicleControllers/vehicleMaintanance/updateMaintananceRecord";
import { newMaintananceRecord } from "../controllers/vehicleControllers/vehicleMaintanance/newMaintananceRecord";
import { upload } from "../middleware/uploads";

export const vehicleMaintananceRoute = Router();

vehicleMaintananceRoute.post(
  "/new-maintanance",
  upload.single("receipt"),
  newMaintananceRecord
);
vehicleMaintananceRoute.get("/get-maintanance", viewMaintanaceRecord);
vehicleMaintananceRoute.get("/get-maintanance/:id", viewMaintanaceRecordById);
vehicleMaintananceRoute.delete(
  "/delete-maintanance/:id",
  deleteMainananceRecord
);
vehicleMaintananceRoute.patch(
  "/update-maintanance/:id",
  upload.single("receipt"),
  updateMaintananceRecord
);

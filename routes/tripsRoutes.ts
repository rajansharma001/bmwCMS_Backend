import { Router } from "express";
import { newTrip } from "../controllers/vehicleControllers/tripControllers/newTrip";
import { viewTrip } from "../controllers/vehicleControllers/tripControllers/viewTrips";
import { viewTripById } from "../controllers/vehicleControllers/tripControllers/viewTripById";
import { updateTrip } from "../controllers/vehicleControllers/tripControllers/updateTrip";
import { deleteTrip } from "../controllers/vehicleControllers/tripControllers/deleteTrip";
import { addPaymentToTrip } from "../controllers/vehicleControllers/tripControllers/addPaymentTrip";

export const tripRoutes = Router();

tripRoutes.post("/new-trip", newTrip);
tripRoutes.get("/get-trip", viewTrip);
tripRoutes.get("/get-trip/:id", viewTripById);
tripRoutes.patch("/update-trip/:id", updateTrip);
tripRoutes.delete("/delete-trip/:id", deleteTrip);

tripRoutes.post("/add-payment/:id", addPaymentToTrip);

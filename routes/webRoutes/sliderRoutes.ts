import { Router } from "express";
import {
  deleteSlider,
  getSlider,
  getSliderById,
  newSlider,
  updateSlider,
} from "../../controllers/webControllers/manageSlider";
import { upload } from "../../middleware/uploads";
import { verifyToken } from "../../middleware/verifyToken";

export const sliderRoutes = Router();

sliderRoutes.post(
  "/new-slider",
  verifyToken,
  upload.single("slideImg"),
  newSlider
);
sliderRoutes.patch(
  "/update-slider/:id",
  verifyToken,
  upload.single("slideImg"),
  updateSlider
);
6;
sliderRoutes.get("/get-slider/:id", verifyToken, getSliderById);
sliderRoutes.delete("/delete-slider/:id", verifyToken, deleteSlider);
sliderRoutes.get("/get-slider", getSlider);

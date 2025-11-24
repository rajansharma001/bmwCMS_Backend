import { Router } from "express";
import {
  getBrands,
  getBrandsById,
  newBrand,
  updateBrand,
} from "../../controllers/webControllers/manageBrand";
import { upload } from "../../middleware/uploads";
import { verifyToken } from "../../middleware/verifyToken";

export const brandRoutes = Router();

brandRoutes.post("/new-brand", verifyToken, upload.single("logo"), newBrand);
brandRoutes.patch(
  "/update-brand/:id",
  verifyToken,
  upload.single("logo"),
  updateBrand
);

brandRoutes.get("/get-brand/:id", getBrandsById);
brandRoutes.get("/get-brand", getBrands);

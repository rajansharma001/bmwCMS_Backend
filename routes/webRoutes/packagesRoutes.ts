import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getPackagesSectionById,
  getPackagesSections,
  newPackagesSection,
  updatePackagesSection,
} from "../../controllers/webControllers/managePackages";

export const packageRoutes = Router();

packageRoutes.post("/new-package-section", verifyToken, newPackagesSection);

packageRoutes.patch(
  "/update-package-section/:id",
  verifyToken,
  updatePackagesSection
);

packageRoutes.get("/get-package-section/:id", getPackagesSectionById);

packageRoutes.get("/get-package-section", getPackagesSections);

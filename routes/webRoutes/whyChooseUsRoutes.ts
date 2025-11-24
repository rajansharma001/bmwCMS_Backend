import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getWhyChooseUs,
  getWhyChooseUsById,
  newWhyChooseUs,
  updateWhyChooseUss,
} from "../../controllers/webControllers/manageWhyChooseUs";
import { upload } from "../../middleware/uploads";

export const whyChooseUsRoutes = Router();

whyChooseUsRoutes.post(
  "/new-whychooseus",
  verifyToken,
  upload.single("image"),
  newWhyChooseUs
);
whyChooseUsRoutes.get("/get-whychooseus", getWhyChooseUs);
whyChooseUsRoutes.get("/get-whychooseus/:id", getWhyChooseUsById);
whyChooseUsRoutes.patch(
  "/update-whychooseus/:id",
  verifyToken,
  updateWhyChooseUss
);

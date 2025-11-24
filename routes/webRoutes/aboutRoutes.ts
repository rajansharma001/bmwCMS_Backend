import { Router } from "express";
import {
  getAbout,
  getAboutById,
  newAbout,
  updateAbout,
} from "../../controllers/webControllers/manageAbout";
import { verifyToken } from "../../middleware/verifyToken";
import { upload } from "../../middleware/uploads";

export const aboutRouter = Router();

aboutRouter.post(
  "/new-about",
  verifyToken,
  upload.single("aboutImage"),
  newAbout
);

aboutRouter.get("/get-about", getAbout);
aboutRouter.get("/get-about/:id", getAboutById);

aboutRouter.patch(
  "/update-about/:id",
  verifyToken,
  upload.single("aboutImage"),
  updateAbout
);

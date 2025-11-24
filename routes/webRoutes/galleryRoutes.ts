import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import { upload } from "../../middleware/uploads";
import {
  getGallery,
  getGalleryById,
  newGallery,
  updateGallery,
} from "../../controllers/webControllers/manageGallery";

export const galleryRoutes = Router();

// Create new gallery (multiple images)
galleryRoutes.post(
  "/new-gallery",
  verifyToken,
  // 1. Place Multer middleware here
  (req, res, next) => {
    upload.array("gallery", 10)(req, res, function (err) {
      if (err instanceof Error) {
        // Ensure proper type check for error
        console.error("Multer Error:", err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  newGallery // 2. Controller is executed only if Multer succeeds
);

// Get all galleries
galleryRoutes.get("/get-gallery", getGallery);

// Get gallery by id
galleryRoutes.get("/get-gallery/:id", getGalleryById);

// Update gallery (optional multiple images)
galleryRoutes.patch(
  "/update-gallery/:id",
  verifyToken,
  upload.array("gallery", 10), // if updating images
  updateGallery
);

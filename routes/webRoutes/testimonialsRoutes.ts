import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getTestimonialById,
  getTestimonials,
  newTestimonial,
  updateTestimonial,
} from "../../controllers/webControllers/manageTestimonials";

export const testimonialRoutes = Router();

testimonialRoutes.post("/new-testimonial", verifyToken, newTestimonial);

testimonialRoutes.patch(
  "/update-testimonial/:id",
  verifyToken,
  updateTestimonial
);
testimonialRoutes.get("/get-testimonial/:id", getTestimonialById);

testimonialRoutes.get("/get-testimonial", getTestimonials);

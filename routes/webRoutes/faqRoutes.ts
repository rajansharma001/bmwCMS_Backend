import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getFAQ,
  getFAQById,
  newFAQ,
  updateFAQ,
} from "../../controllers/webControllers/manageFAQ";

export const faqRoutes = Router();

faqRoutes.post("/new-faq", verifyToken, newFAQ);

faqRoutes.patch("/update-faq/:id", verifyToken, updateFAQ);

faqRoutes.get("/get-faq/:id", getFAQById);

faqRoutes.get("/get-faq", getFAQ);

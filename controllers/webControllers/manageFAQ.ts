import { Request, Response } from "express";
import { FAQItem, FAQPageSectionModel } from "../../model/webModel/faqModel";

// --- Interface for FAQ data received in the request body ---
interface FAQRequestBody {
  heading: string;
  title: string;
  shortDescription: string;
  faqs: FAQItem[];
}

export const newFAQ = async (req: Request, res: Response) => {
  try {
    const { heading, title, shortDescription, faqs }: FAQRequestBody = req.body;

    if (!heading || !title || !shortDescription) {
      return res
        .status(400)
        .json({ error: "Heading, title, and description are required." });
    }

    const existing = await FAQPageSectionModel.find();
    if (existing.length >= 1) {
      return res.status(409).json({
        error: "FAQ Section already exists. Please edit the existing document.",
      });
    }

    // 2. Create the document
    const newFAQSection = await FAQPageSectionModel.create({
      heading,
      title,
      shortDescription,
      faqs: faqs || [],
    });

    return res
      .status(201)
      .json({ success: "FAQ Section created successfully.", newFAQSection });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const faqId = req.params.id;
    if (!faqId) {
      return res.status(400).json({ error: "FAQ Section Id is required." });
    }

    const existingFAQ = await FAQPageSectionModel.findById(faqId);
    if (!existingFAQ) {
      return res.status(404).json({ error: "FAQ Section not found." });
    }

    const { heading, title, shortDescription, faqs }: FAQRequestBody = req.body;

    const updated = await FAQPageSectionModel.findByIdAndUpdate(
      faqId,
      {
        heading: heading || existingFAQ.heading,
        title: title || existingFAQ.title,
        shortDescription: shortDescription || existingFAQ.shortDescription,
        faqs: faqs || existingFAQ.faqs,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(500).json({ error: "Update failed unexpectedly." });
    }

    return res
      .status(200)
      .json({ success: "FAQ Section updated successfully.", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getFAQ = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQPageSectionModel.find();

    if (!faqs || faqs.length === 0) {
      return res.status(404).json({ error: "No FAQ sections found." });
    }

    return res
      .status(200)
      .json({ success: "FAQ sections fetched successfully.", faqs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getFAQById = async (req: Request, res: Response) => {
  try {
    const faqId = req.params.id;
    if (!faqId) {
      return res.status(400).json({ error: "FAQ Section Id is required." });
    }

    const faq = await FAQPageSectionModel.findById(faqId);
    if (!faq) {
      return res.status(404).json({ error: "FAQ Section not found." });
    }

    return res
      .status(200)
      .json({ success: "FAQ Section fetched successfully.", faq });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

import { Request, Response } from "express";
import {
  ReviewItem,
  TestimonialPageSectionModel,
} from "../../model/webModel/testimonialsModel";

interface TestimonialRequestBody {
  heading: string;
  title: string;
  shortDescription: string;
  reviews: ReviewItem[];
}

export const newTestimonial = async (req: Request, res: Response) => {
  try {
    const {
      heading,
      title,
      shortDescription,
      reviews,
    }: TestimonialRequestBody = req.body;

    if (!heading || !title || !shortDescription) {
      return res
        .status(400)
        .json({ error: "Heading, title, and description are required." });
    }

    const existing = await TestimonialPageSectionModel.find();
    if (existing.length >= 1) {
      return res.status(409).json({
        error:
          "Testimonial Section already exists. Please edit the existing document.",
      });
    }

    const newSection = await TestimonialPageSectionModel.create({
      heading,
      title,
      shortDescription,
      reviews: reviews || [],
    });

    return res
      .status(201)
      .json({
        success: "Testimonial Section created successfully.",
        newSection,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonialId = req.params.id;
    if (!testimonialId) {
      return res
        .status(400)
        .json({ error: "Testimonial Section Id is required." });
    }

    const existingTestimonial = await TestimonialPageSectionModel.findById(
      testimonialId
    );
    if (!existingTestimonial) {
      return res.status(404).json({ error: "Testimonial Section not found." });
    }

    const {
      heading,
      title,
      shortDescription,
      reviews,
    }: TestimonialRequestBody = req.body;

    const updated = await TestimonialPageSectionModel.findByIdAndUpdate(
      testimonialId,
      {
        heading: heading || existingTestimonial.heading,
        title: title || existingTestimonial.title,
        shortDescription:
          shortDescription || existingTestimonial.shortDescription,
        reviews: reviews || existingTestimonial.reviews,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(500).json({ error: "Update failed unexpectedly." });
    }

    return res
      .status(200)
      .json({ success: "Testimonial Section updated successfully.", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await TestimonialPageSectionModel.find();

    if (!testimonials || testimonials.length === 0) {
      return res
        .status(200)
        .json({ success: "No testimonial sections found.", testimonials: [] });
    }

    return res
      .status(200)
      .json({
        success: "Testimonial sections fetched successfully.",
        testimonials,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const testimonialId = req.params.id;
    if (!testimonialId) {
      return res
        .status(400)
        .json({ error: "Testimonial Section Id is required." });
    }

    const testimonial = await TestimonialPageSectionModel.findById(
      testimonialId
    );
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial Section not found." });
    }

    return res
      .status(200)
      .json({
        success: "Testimonial Section fetched successfully.",
        testimonial,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

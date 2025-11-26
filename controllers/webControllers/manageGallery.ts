import { Request, Response } from "express";
import { GalleryModel } from "../../model/webModel/galleryModel";
import mongoose from "mongoose";

interface GalleryImageItem {
  image: string;
  _id?: string;
}

// Create new gallery
export const newGallery = async (req: Request, res: Response) => {
  try {
    console.log("Running 1");

    const { heading, title, shortDescription } = req.body;
    const files = req.files as any[];

    if (!heading || !title || !shortDescription) {
      return res
        .status(400)
        .json({ error: "Heading, title, and description are required" });
    }

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one gallery image is required" });
    }

    // Map files to gallery items
    const gallery = files.map((file) => ({
      image: file.path,
      caption: "",
    }));

    const existing = await GalleryModel.find();
    if (existing.length >= 1) {
      return res.status(409).json({
        error: "Gallery already exist. Please edit existing gallery.",
      });
    }

    const newGallery = await GalleryModel.create({
      heading,
      title,
      shortDescription,
      gallery,
    });

    console.log("Gallery created:", newGallery);

    return res
      .status(201)
      .json({ success: "Gallery created successfully.", newGallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateGallery = async (req: Request, res: Response) => {
  try {
    const galleryId = req.params.id;
    if (!galleryId) {
      return res.status(400).json({ error: "Gallery Id is required." });
    }

    const existingGallery = await GalleryModel.findById(galleryId);
    if (!existingGallery) {
      return res.status(404).json({ error: "Gallery not found." });
    }

    // Parse kept images from frontend
    const existingGalleryIds = JSON.parse(req.body.existingGalleryIds || "[]");

    // Filter out removed images
    const keptImages = existingGallery.gallery.filter((img) =>
      existingGalleryIds.includes(img._id.toString())
    );

    // New uploaded files
    const files = req.files as any[];

    const newImages = (files || []).map((file) => ({
      image: file.path,
      _id: new mongoose.Types.ObjectId().toString(),
    }));

    // Final gallery = kept old + new uploaded
    const finalGallery = [...keptImages, ...newImages];

    const updated = await GalleryModel.findByIdAndUpdate(
      galleryId,
      {
        heading: req.body.heading || existingGallery.heading,
        title: req.body.title || existingGallery.title,
        shortDescription:
          req.body.shortDescription || existingGallery.shortDescription,
        gallery: finalGallery,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: "Gallery updated successfully", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

// Get all galleries
export const getGallery = async (req: Request, res: Response) => {
  try {
    const galleries = await GalleryModel.find();
    if (!galleries || galleries.length === 0) {
      return res.status(404).json({ error: "No galleries found." });
    }
    return res
      .status(200)
      .json({ success: "Galleries fetched successfully.", galleries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

// Get gallery by id
export const getGalleryById = async (req: Request, res: Response) => {
  try {
    const galleryId = req.params.id;
    if (!galleryId) {
      return res.status(400).json({ error: "Gallery Id is required." });
    }

    const gallery = await GalleryModel.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found." });
    }

    return res
      .status(200)
      .json({ success: "Gallery fetched successfully.", gallery });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

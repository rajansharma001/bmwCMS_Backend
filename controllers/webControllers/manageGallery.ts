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
    const { heading, title, shortDescription } = req.body;
    const files = req.files as any[];

    const gallery = files.map((file) => ({
      image: file.path,
      caption: "",
    }));

    // 1. Start with the existing gallery array
    const keptExistingImages: GalleryImageItem[] =
      existingGallery.gallery || [];

    // 2. Map the newly uploaded files
    const newImages: GalleryImageItem[] = [];

    if (files && files.length > 0) {
      newImages.push(
        ...files.map((file) => ({
          image: file.path,
          _id: new mongoose.Types.ObjectId().toString(), // Convert to string if your interface expects string
        }))
      );
    }

    // 3. Combine existing images and new images
    const finalGallery = [...keptExistingImages, ...newImages];

    // 4. Update the gallery document
    const updated = await GalleryModel.findByIdAndUpdate(
      galleryId,
      {
        heading: heading || existingGallery.heading,
        title: title || existingGallery.title,
        shortDescription: shortDescription || existingGallery.shortDescription,
        // Use the combined array
        gallery: finalGallery,
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(500).json({ error: "Update failed unexpectedly." });
    }

    return res
      .status(200)
      .json({ success: "Gallery updated successfully.", updated });
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

import { Request, Response } from "express";
import { AboutModel } from "../../model/webModel/aboutModel";

export const newAbout = async (req: Request, res: Response) => {
  try {
    const { heading, title, paragraph, aboutImage } = req.body;

    if (!heading || !title || !paragraph) {
      return res.status(404).json({ error: "All fields are required." });
    }
    const file = req.file;
    if (!file) {
      return res
        .status(404)
        .json({ error: "About section image is required." });
    }
    const imageFile = file.path || "";

    const checkAbout = await AboutModel.find();
    if (checkAbout.length >= 1) {
      return res.status(409).json({
        error: "About already exist. Please updated existing about details.",
      });
    }
    await AboutModel.create({
      heading,
      title,
      paragraph,
      aboutImage: imageFile,
    });

    return res
      .status(201)
      .json({ success: "About details added successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
export const getAbout = async (req: Request, res: Response) => {
  try {
    const getAbout = await AboutModel.find();
    if (!getAbout) {
      return res.status(404).json({ error: "About not found." });
    }
    return res
      .status(200)
      .json({ success: "About details fetched successfully.", getAbout });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAboutById = async (req: Request, res: Response) => {
  try {
    const aboutId = req.params.id;
    if (!aboutId) {
      return res.status(400).json({ error: "About details Id not found." });
    }

    const getAboutById = await AboutModel.findById(aboutId);
    if (!getAboutById) {
      return res.status(404).json({ error: "Brand not found." });
    }
    return res
      .status(200)
      .json({ success: "About details fetched successfully.", getAboutById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const aboutId = req.params.id;
    if (!aboutId) {
      return res.status(400).json({ error: "About Id not found." });
    }

    const { heading, title, paragraph, aboutImage } = req.body;
    const file = req.file;
    if (!file) {
      return res
        .status(404)
        .json({ error: "About section image is required." });
    }
    const imageFile = file.path || "";

    const checkAbout = await AboutModel.findById(aboutId);
    if (!checkAbout) {
      return res.status(404).json({ error: "Brand not found." });
    }

    const updateBrand = await AboutModel.findByIdAndUpdate(aboutId, {
      heading: heading || checkAbout.heading,
      title: title || checkAbout.title,
      paragraph: paragraph || checkAbout.paragraph,
      aboutImage: imageFile || checkAbout.aboutImage,
    });
    if (!updateBrand) {
      return res
        .status(400)
        .json({ error: "Error while updating about details." });
    }
    return res
      .status(200)
      .json({ success: "About detaild updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

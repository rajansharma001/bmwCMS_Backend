import { Request, Response } from "express";
import { SliderModel } from "../../model/webModel/sliderModel";

export const newSlider = async (req: Request, res: Response) => {
  try {
    const { heading, title, paragraph } = req.body;
    if (!heading || !title || !paragraph) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Slider image is required." });
    }
    const slideImage = file?.path || "";

    const addSlide = await SliderModel.create({
      heading,
      title,
      paragraph,
      slideImg: slideImage,
    });
    if (!addSlide) {
      return res.status(400).json({ error: "Error while creating new slide." });
    }
    return res.status(201).json({ success: "Slider created successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateSlider = async (req: Request, res: Response) => {
  try {
    console.log("Running 1");
    const sliderId = req.params.id;
    if (!sliderId) {
      return res.status(404).json({ error: "Slider Id not found." });
    }
    console.log("Running 2");

    const { heading, title, paragraph } = req.body;

    const file = req.file;
    const slideImage = file?.path || "";
    console.log("Running 3");

    const checkSlider = await SliderModel.findById(sliderId);
    if (!checkSlider) {
      return res.status(404).json({ error: "Slider not found." });
    }
    console.log("Running 4");

    const updateSlide = await SliderModel.findByIdAndUpdate(sliderId, {
      heading: heading || checkSlider.heading,
      title: title || checkSlider.title,
      paragraph: paragraph || checkSlider.paragraph,
      slideImg: slideImage || checkSlider.slideImg,
    });
    if (!updateSlide) {
      return res.status(400).json({ error: "Error while updating new slide." });
    }

    console.log("Running 5");

    return res.status(201).json({ success: "Slider updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getSlider = async (req: Request, res: Response) => {
  try {
    const getSlider = await SliderModel.find();
    if (!getSlider) {
      return res.status(404).json({ error: "Slider not found." });
    }
    return res
      .status(200)
      .json({ success: "Slider fetched successfully.", getSlider });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getSliderById = async (req: Request, res: Response) => {
  try {
    const sliderId = req.params.id;
    if (!sliderId) {
      return res.status(404).json({ error: "Slider Id not found." });
    }
    const getSliderById = await SliderModel.findById(sliderId);
    if (!getSliderById) {
      return res.status(404).json({ error: "Slider not found." });
    }
    return res
      .status(200)
      .json({ success: "Slider fetched successfully.", getSliderById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const deleteSlider = async (req: Request, res: Response) => {
  try {
    const sliderId = req.params.id;
    if (!sliderId) {
      return res.status(404).json({ error: "Slider Id not found." });
    }
    const getSliderById = await SliderModel.findById(sliderId);
    if (!getSliderById) {
      return res.status(404).json({ error: "Slider not found." });
    }
    await SliderModel.findByIdAndDelete(sliderId);
    return res.status(200).json({ success: "Slider deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

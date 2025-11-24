import { Request, Response } from "express";
import { brandModel } from "../../model/webModel/brandModel";
import { error } from "console";

export const newBrand = async (req: Request, res: Response) => {
  try {
    const { title, subTitle } = req.body;
    if (!title) {
      return res
        .status(404)
        .json({ error: "Logo and title fields are required." });
    }

    const file = req.file;
    const logoFile = file?.path || "";
    const checkBrand = await brandModel.find();
    if (checkBrand.length >= 1) {
      return res.status(409).json({
        error: "Brand already exist. Please updated existing brand details.",
      });
    }

    await brandModel.create({
      logo: logoFile,
      title,
      subTitle,
    });

    return res
      .status(201)
      .json({ success: "Brand details added successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brandId = req.params.id;
    if (!brandId) {
      return res.status(400).json({ error: "Brand Id not found." });
    }

    const { title, subTitle } = req.body;
    const file = req.file;
    const logoFile = file?.path || "";

    const checkBrand = await brandModel.findById(brandId);
    if (!checkBrand) {
      return res.status(404).json({ error: "Brand not found." });
    }

    const updateBrand = await brandModel.findByIdAndUpdate(brandId, {
      logo: logoFile || checkBrand.logo,
      title: title || checkBrand.title,
      subTitle: subTitle || checkBrand.subTitle,
    });
    if (!updateBrand) {
      return res
        .status(400)
        .json({ error: "Error while updating brand details." });
    }
    return res
      .status(200)
      .json({ success: "Brand detaild updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const getBrand = await brandModel.find();
    if (!getBrand) {
      return res.status(404).json({ error: "Brand not found." });
    }
    return res
      .status(200)
      .json({ success: "Brand fetched successfully.", getBrand });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getBrandsById = async (req: Request, res: Response) => {
  try {
    const brandId = req.params.id;
    if (!brandId) {
      return res.status(400).json({ error: "Brand Id not found." });
    }

    const getBrandById = await brandModel.findById(brandId);
    if (!getBrandById) {
      return res.status(404).json({ error: "Brand not found." });
    }
    return res
      .status(200)
      .json({ success: "Brand fetched successfully.", getBrandById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

import { Request, Response } from "express";
import { ServicesModel } from "../../model/webModel/servicesModel";

export const newServices = async (req: Request, res: Response) => {
  try {
    const { heading, title, shortDescription, items } = req.body;

    if (!heading || !title || !shortDescription || !items || !items.length) {
      return res.status(400).json({ error: "All fields are required" });
    }

    for (const item of items) {
      if (!item.icon || !item.title || !item.paragraph || !item.link) {
        return res.status(400).json({ error: "All item fields are required" });
      }
    }

    const checkServices = await ServicesModel.find();
    if (checkServices.length >= 1) {
      return res.status(409).json({
        error: "Services already exist. Please edit existing services details.",
      });
    }
    const newSection = await ServicesModel.create({
      heading,
      title,
      shortDescription,
      items,
    });

    return res.status(201).json({ success: "Services created successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateServices = async (req: Request, res: Response) => {
  console.log("Params ID: ", req.params);
  try {
    const serviceId = req.params.id;
    if (!serviceId) {
      return res.status(400).json({ error: "Service Id is required." });
    }
    const checkServices = await ServicesModel.findById(serviceId);
    if (!checkServices) {
      return res.status(404).json({ error: "Service not found." });
    }
    const { heading, title, shortDescription, items } = req.body;
    if (items.length > 6) {
      return res.status(409).json({
        error:
          "Maximum services limit reached. Please edit or remove to add new service.",
      });
    }
    const updateService = await ServicesModel.findByIdAndUpdate(serviceId, {
      heading: heading || checkServices.heading,
      title: title || checkServices.title,
      shortDescription: shortDescription || checkServices.shortDescription,
      items: items || checkServices.items,
    });
    if (!updateService) {
      return res.status(409).json({ error: "Error while updating service." });
    }

    return res.status(200).json({ success: "Service updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const getServices = await ServicesModel.find();
    if (!getServices) {
      return res.status(404).json({ error: "Service not found." });
    }
    return res.status(200).json({
      success: "Services fetched successfully.",
      getServices,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getServicesById = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;
    if (!serviceId) {
      return res.status(400).json({ error: "Service Id is required." });
    }
    const getServicesById = await ServicesModel.findById(serviceId);
    if (!getServicesById) {
      return res.status(404).json({ error: "Service not found." });
    }
    return res.status(200).json({
      success: "Services fetched by id successfully.",
      getServicesById,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

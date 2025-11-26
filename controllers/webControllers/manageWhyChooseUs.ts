import { Request, Response } from "express";
import { WhyChooseUsModel } from "../../model/webModel/whyChooseUsModel";

export const newWhyChooseUs = async (req: Request, res: Response) => {
  try {
    const { heading, title, shortDescription } = req.body;
    let { items } = req.body;

    console.log("Is this controller hitting on gallery route???????");
    // Parse items first
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch (err) {
        return res.status(400).json({ error: "Invalid items format" });
      }
    }

    // Now validate
    if (!heading || !title || !shortDescription) {
      return res.status(400).json({ error: "All fields are required" });
    }

    for (const item of items) {
      if (!item.icon || !item.title || !item.paragraph) {
        return res.status(400).json({ error: "All item fields are required" });
      }
    }

    const file = req.file;
    const imageFile = file?.path || "";

    const existing = await WhyChooseUsModel.find();
    if (existing.length >= 1) {
      return res.status(409).json({
        error:
          "WhyChooseUs already exist. Please edit existing WhyChooseUs details.",
      });
    }

    const newWhyChooseUs = await WhyChooseUsModel.create({
      heading,
      title,
      shortDescription,
      image: imageFile,
      items,
    });

    return res
      .status(201)
      .json({ success: "WhyChooseUs created successfully.", newWhyChooseUs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateWhyChooseUss = async (req: Request, res: Response) => {
  try {
    const whyChooseUsId = req.params.id;
    if (!whyChooseUsId) {
      return res.status(400).json({ error: "WhyChooseUs Id is required." });
    }
    console.log(req.body);
    console.log("Running 1");
    const checkWhyChooseUs = await WhyChooseUsModel.findById(whyChooseUsId);
    if (!checkWhyChooseUs) {
      return res.status(404).json({ error: "WhyChooseUs not found." });
    }
    console.log("Running 2");

    const file = req.file;
    const imageFile = file?.path || "";

    const { heading, title, shortDescription } = req.body;
    let { items } = req.body;

    // Parse items first
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch (err) {
        return res.status(400).json({ error: "Invalid items format" });
      }
    }

    if (items.length > 3) {
      return res.status(409).json({
        error:
          "Maximum WhyChooseUs limit reached. Please edit or remove to add new WhyChooseUs.",
      });
    }

    console.log("Running 4");

    const updateWhyChooseUs = await WhyChooseUsModel.findByIdAndUpdate(
      whyChooseUsId,
      {
        heading: heading || checkWhyChooseUs.heading,
        title: title || checkWhyChooseUs.title,
        image: imageFile || checkWhyChooseUs.image,
        shortDescription: shortDescription || checkWhyChooseUs.shortDescription,
        items: items || checkWhyChooseUs.items,
      }
    );
    if (!updateWhyChooseUs) {
      return res
        .status(409)
        .json({ error: "Error while updating WhyChooseUs." });
    }
    console.log("Running 5");

    return res
      .status(200)
      .json({ success: "WhyChooseUs updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getWhyChooseUs = async (req: Request, res: Response) => {
  try {
    const getWhyChooseUs = await WhyChooseUsModel.find();
    if (!getWhyChooseUs) {
      return res.status(404).json({ error: "WhyChooseUs not found." });
    }
    return res.status(200).json({
      success: "WhyChooseUs fetched successfully.",
      getWhyChooseUs,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getWhyChooseUsById = async (req: Request, res: Response) => {
  try {
    const whyChooseUsId = req.params.id;
    if (!whyChooseUsId) {
      return res.status(400).json({ error: "WhyChooseUs Id is required." });
    }
    const getWhyChooseUsById = await WhyChooseUsModel.findById(whyChooseUsId);
    if (!getWhyChooseUsById) {
      return res.status(404).json({ error: "WhyChooseUs not found." });
    }
    return res.status(200).json({
      success: "WhyChooseUs fetched by id successfully.",
      getWhyChooseUsById,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

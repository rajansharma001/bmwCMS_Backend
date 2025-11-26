import { Request, Response } from "express";
import {
  PackageItem,
  PackagesSectionModel,
} from "../../model/webModel/packagesModel";

// --- Interface for Package data received in the request body ---
interface PackagesRequestBody {
  heading: string;
  title: string;
  shortDescription: string;
  packages: PackageItem[];
}

// -----------------------------------------------------------
// Helper Function for Validation
// -----------------------------------------------------------

const validatePackageItem = (pkg: PackageItem): string | null => {
  if (!pkg.name || pkg.name.trim() === "") return "Package name is required.";
  if (typeof pkg.price !== "number" || pkg.price < 0)
    return "Valid price is required.";
  if (!pkg.priceUnit || pkg.priceUnit.trim() === "")
    return "Price unit ($, €, etc.) is required.";
  if (!pkg.billingCycle || pkg.billingCycle.trim() === "")
    return "Billing cycle (per month, etc.) is required.";
  if (!pkg.callToAction || pkg.callToAction.trim() === "")
    return "Call to Action text is required.";
  if (!Array.isArray(pkg.features) || pkg.features.length === 0)
    return "At least one feature is required.";

  // Discounted Price Validation
  if (pkg.hasDiscount) {
    if (typeof pkg.discountedPrice !== "number" || pkg.discountedPrice < 0)
      return "Discounted price must be a non-negative number when discount is active.";
    if (pkg.discountedPrice >= pkg.price)
      return "Discounted price must be less than the regular price.";
  }

  // Special Offer Validation
  if (pkg.hasSpecialOffer) {
    if (!pkg.specialOfferTitle || pkg.specialOfferTitle.trim() === "")
      return "Special Offer Title is required when an offer is active.";
    if (!pkg.specialOfferDetails || pkg.specialOfferDetails.trim() === "")
      return "Special Offer Details are required when an offer is active.";
  }

  return null; // Validation successful
};

export const newPackagesSection = async (req: Request, res: Response) => {
  try {
    const { heading, title, shortDescription, packages }: PackagesRequestBody =
      req.body;

    // 1. Validation for static fields
    if (!heading || !title || !shortDescription) {
      return res
        .status(400)
        .json({ error: "Heading, title, and description are required." });
    }

    // Prevent creating duplicates (assuming only one Packages section per site)
    const existing = await PackagesSectionModel.find();
    if (existing.length >= 1) {
      return res.status(409).json({
        error:
          "Packages Section already exists. Please edit the existing document.",
      });
    }

    // 2. Validate dynamic package items
    if (packages && packages.length > 0) {
      for (const pkg of packages) {
        const validationError = validatePackageItem(pkg);
        if (validationError) {
          return res
            .status(400)
            .json({ error: `Package Validation Error: ${validationError}` });
        }
      }
    }

    // 3. Create the document
    const newSection = await PackagesSectionModel.create({
      heading,
      title,
      shortDescription,
      packages: packages || [],
    });

    return res
      .status(201)
      .json({ success: "Packages Section created successfully.", newSection });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updatePackagesSection = async (req: Request, res: Response) => {
  try {
    const packagesId = req.params.id;
    if (!packagesId) {
      return res
        .status(400)
        .json({ error: "Packages Section Id is required." });
    }

    const existingPackages = await PackagesSectionModel.findById(packagesId);
    if (!existingPackages) {
      return res.status(404).json({ error: "Packages Section not found." });
    }

    const { heading, title, shortDescription, packages }: PackagesRequestBody =
      req.body;

    // 1. Validate dynamic package items for update
    if (packages && packages.length > 0) {
      for (const pkg of packages) {
        const validationError = validatePackageItem(pkg);
        if (validationError) {
          return res
            .status(400)
            .json({ error: `Package Validation Error: ${validationError}` });
        }
      }
    }

    // 2. Update the document
    const updated = await PackagesSectionModel.findByIdAndUpdate(
      packagesId,
      {
        heading: heading || existingPackages.heading,
        title: title || existingPackages.title,
        shortDescription: shortDescription || existingPackages.shortDescription,
        packages: packages || existingPackages.packages, // Replace the entire array
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(500).json({ error: "Update failed unexpectedly." });
    }

    return res
      .status(200)
      .json({ success: "Packages Section updated successfully.", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getPackagesSections = async (req: Request, res: Response) => {
  try {
    const packagesSections = await PackagesSectionModel.find();

    if (!packagesSections || packagesSections.length === 0) {
      return res
        .status(200)
        .json({ success: "No packages sections found.", packagesSections: [] });
    }

    return res.status(200).json({
      success: "Packages sections fetched successfully.",
      packagesSections,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getPackagesSectionById = async (req: Request, res: Response) => {
  try {
    const packagesId = req.params.id;
    if (!packagesId) {
      return res
        .status(400)
        .json({ error: "Packages Section Id is required." });
    }

    const packagesSection = await PackagesSectionModel.findById(packagesId);
    if (!packagesSection) {
      return res.status(404).json({ error: "Packages Section not found." });
    }

    return res.status(200).json({
      success: "Packages Section fetched successfully.",
      packagesSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

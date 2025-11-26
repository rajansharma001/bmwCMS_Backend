import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image");

    return {
      folder: "bmw_uploads",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
      ...(isImage && {
        transformation: [
          { width: 1920, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "auto" },
          { effect: "enhance" },
          {
            aspect_ratio: "1:1",
            gravity: "center",
            background: "gen_fill",
            crop: "pad",
          },
        ],
      }),
    };
  },
});

export const upload = multer({ storage });

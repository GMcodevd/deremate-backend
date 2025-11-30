import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configuración del storage de Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "deremate_uploads", // Carpeta en tu Cloudinary (puede tener otro nombre)
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, crop: "limit" }], // opcional: limita tamaño
  },
});

// Middleware final de multer
export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

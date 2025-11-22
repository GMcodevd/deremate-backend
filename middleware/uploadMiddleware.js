import multer from "multer";
import path from "path";
import fs from "fs";

// Carpeta donde se guardarán las imágenes
const uploadPath = path.join(process.cwd(), "uploads");

// Si no existe la carpeta, se crea automáticamente
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // nombre único: timestamp + nombre original
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filtro para aceptar solo imágenes válidas
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("Solo se permiten imágenes (JPEG, PNG o WEBP)"), false);
  }
};

// Configuración final del middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

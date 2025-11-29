import dotenv from 'dotenv';
dotenv.config();

console.log("Cloudinary conectado:", process.env.CLOUDINARY_CLOUD_NAME ? "OK" : "ERROR");

import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import productRouter from "./routes/mate.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

// --- Variables de entorno ---
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/derematepage";
const FRONTEND_URL = process.env.FRONTEND_URL || "";


// --- Middlewares globales ---
app.use(helmet());            // Seguridad por cabeceras
app.use(compression());       // Compresión gzip
app.use(express.json());      // Parseo de JSON

// --- CORS ---
app.use(cors({
  origin: "*"
}));


// --- Servir carpeta de imágenes con CORS habilitado ---
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    setHeaders: (res) => {
      // Permite acceso desde el frontend
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  })
);

// --- Rutas principales ---
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);

// --- Conexión MongoDB ---
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(" Error al conectar MongoDB:", err));

// --- Levantar servidor ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

import Producto from "../model/mates.model.js";
import { v2 as cloudinary } from "cloudinary"; // Se mantiene la importación por si la usas en el futuro, pero no se configura aquí.

// --- ELIMINADA LA CONFIGURACIÓN REDUNDANTE DE CLOUDINARY ---
/*
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
*/

// Obtener productos
export const getProducts = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error("ERROR getProducts:", error);
    res.status(500).json({ message: "Error obteniendo productos" });
    console.error("ERROR DETALLADO (STACK):", error.stack);
    console.error("MENSAJE ESPECÍFICO:", error.message);
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    // 1. Manejo de la imagen: TOMAMOS LA URL YA SUBIDA POR MULTER
    if (req.file) {
      imageUrl = req.file.path; // ✅ CORRECTO: URL de Cloudinary proporcionada por multer-storage-cloudinary
    }

    // 2. CREACIÓN del nuevo Producto (Alineado con el modelo: name, category)
    const nuevoProducto = new Producto({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock || 0,
      image: imageUrl,
    });

    const saved = await nuevoProducto.save();
    res.json(saved);

  } catch (error) {
    console.error("ERROR createProduct:", error);
    res.status(500).json({ message: "Error creando producto" });
    // Logs de error detallados
    console.error("ERROR DETALLADO (STACK):", error.stack);
    console.error("MENSAJE ESPECÍFICO:", error.message);
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    let newImageUrl = req.body.image;

    // 1. Manejo de la nueva imagen si se sube (TOMAMOS LA URL YA SUBIDA POR MULTER)
    if (req.file) {
      newImageUrl = req.file.path; // ✅ CORRECTO: URL de Cloudinary proporcionada por multer-storage-cloudinary
    }

    // 2. ACTUALIZACIÓN del producto (Alineado con el modelo)
    const updated = await Producto.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock,
        image: newImageUrl
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("ERROR updateProduct:", error);
    res.status(500).json({ message: "Error actualizando producto" });
    // Logs de error detallados
    console.error("ERROR DETALLADO (STACK):", error.stack);
    console.error("MENSAJE ESPECÍFICO:", error.message);
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Producto.findByIdAndDelete(id);

    res.json({ message: "Producto eliminado", deleted });
  } catch (error) {
    console.error("ERROR deleteProduct:", error);
    res.status(500).json({ message: "Error eliminando producto" });
    // Logs de error detallados
    console.error("ERROR DETALLADO (STACK):", error.stack);
    console.error("MENSAJE ESPECÍFICO:", error.message);
  }
};
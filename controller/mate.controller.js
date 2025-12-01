import Producto from "../model/mates.model.js";
import { v2 as cloudinary } from "cloudinary";

// Configuración directa de Cloudinary (usa `.env`)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Obtener productos
export const getProducts = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error("ERROR getProducts:", error);
    res.status(500).json({ message: "Error obteniendo productos" });
    // Mantengo los logs de error detallados que tenías para facilitar el debug
    console.error("ERROR getProducts:", error?.message);
    console.error("FULL ERROR:", JSON.stringify(error, null, 2));

  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    // 1. Manejo de la imagen (Subida a Cloudinary)
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "deremate-products"
      });
      imageUrl = uploadResult.secure_url;
    }

    // 2. CREACIÓN del nuevo Producto con los campos correctos del MODELO
    const nuevoProducto = new Producto({
      // **CORRECCIÓN: Se cambió 'title' por 'name' y se agregó 'category'**
      name: req.body.name, // <-- AHORA USA EL CAMPO 'name'
      category: req.body.category, // <-- AHORA INCLUYE EL CAMPO OBLIGATORIO 'category'
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock || 0, // Añadido opcionalmente si lo envías
      image: imageUrl,
    });

    const saved = await nuevoProducto.save();
    res.json(saved);

  } catch (error) {
    console.error("ERROR createProduct:", error);
    res.status(500).json({ message: "Error creando producto" });
    // Logs de error detallados
    // 💡 Muestra el stack trace completo del error
  console.error("ERROR DETALLADO (STACK):", error.stack); 
  
  // 💡 Intenta obtener el mensaje de error explícito
  console.error("MENSAJE ESPECÍFICO:", error.message);
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    let newImageUrl = req.body.image;

    // 1. Manejo de la nueva imagen si se sube
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "deremate-products"
      });

      newImageUrl = uploadResult.secure_url;
    }

    // 2. ACTUALIZACIÓN del producto con los campos correctos del MODELO
    const updated = await Producto.findByIdAndUpdate(
      id,
      {
        // **CORRECCIÓN: Se cambió 'title' por 'name' y se agregó 'category'**
        name: req.body.name, // <-- AHORA USA EL CAMPO 'name'
        category: req.body.category, // <-- AÑADIDO 'category' para que pueda actualizarse
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock, // Añadido opcionalmente
        image: newImageUrl
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("ERROR updateProduct:", error);
    res.status(500).json({ message: "Error actualizando producto" });
    // Logs de error detallados
    console.error("ERROR updateProduct:", error?.message);
    console.error("FULL ERROR:", JSON.stringify(error, null, 2));

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
    console.error("ERROR deleteProduct:", error?.message);
    console.error("FULL ERROR:", JSON.stringify(error, null, 2));

  }
};
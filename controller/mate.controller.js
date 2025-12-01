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
    console.error("ERROR createProduct:", error?.message);
console.error("FULL ERROR:", JSON.stringify(error, null, 2));

  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "deremate-products"
      });
      imageUrl = uploadResult.secure_url;
    }

    const nuevoProducto = new Producto({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: imageUrl,
    });

    const saved = await nuevoProducto.save();
    res.json(saved);

  } catch (error) {
    console.error("ERROR createProduct:", error);
    res.status(500).json({ message: "Error creando producto" });
    console.error("ERROR createProduct:", error?.message);
console.error("FULL ERROR:", JSON.stringify(error, null, 2));

  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    let newImageUrl = req.body.image;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "deremate-products"
      });

      newImageUrl = uploadResult.secure_url;
    }

    const updated = await Producto.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: newImageUrl
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("ERROR updateProduct:", error);
    res.status(500).json({ message: "Error actualizando producto" });
    console.error("ERROR createProduct:", error?.message);
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
    console.error("ERROR createProduct:", error?.message);
console.error("FULL ERROR:", JSON.stringify(error, null, 2));

  }
};

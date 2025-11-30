import Product from "../model/mates.model.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

// ===============================
//   CREAR PRODUCTO
// ===============================
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;

    let image = "";

    // Si viene archivo -> subir a cloudinary
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      image = uploadResult.secure_url;
    }

    // Si viene imageUrl desde el front (no debería en create, pero por seguridad)
    if (!req.file && req.body.imageUrl) {
      image = req.body.imageUrl;
    }

    const nuevoProducto = new Product({
      name,
      category,
      description,
      price,
      stock,
      image
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({
      ok: true,
      message: "Producto creado con éxito",
      producto: productoGuardado
    });

  } catch (error) {
    console.error("Error en createProduct:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear producto",
      error: error.message
    });
  }
};

// ===============================
//   ACTUALIZAR PRODUCTO
// ===============================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let { name, category, description, price, stock, imageUrl } = req.body;

    const productoExistente = await Product.findById(id);
    if (!productoExistente) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    // Manejo de imagen (archivo nuevo o mantener existente)
    let image = productoExistente.image;

    if (req.file) {
      // Hay archivo nuevo → subir a Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path);
      image = uploadResult.secure_url;
    } else if (imageUrl) {
      // No se sube archivo → mantener la existente
      image = imageUrl;
    }

    productoExistente.name = name;
    productoExistente.category = category;
    productoExistente.description = description;
    productoExistente.price = price;
    productoExistente.stock = stock;
    productoExistente.image = image;

    const productoActualizado = await productoExistente.save();

    res.status(200).json({
      ok: true,
      message: "Producto actualizado",
      producto: productoActualizado
    });

  } catch (error) {
    console.error("Error en updateProduct:", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar producto",
      error: error.message
    });
  }
};

// ===============================
//   OBTENER TODOS LOS PRODUCTOS
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener productos"
    });
  }
};

// ===============================
//   ELIMINAR PRODUCTO
// ===============================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Product.findById(id);
    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado"
      });
    }

    await producto.deleteOne();

    res.status(200).json({
      ok: true,
      message: "Producto eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar producto",
      error: error.message
    });
  }
};

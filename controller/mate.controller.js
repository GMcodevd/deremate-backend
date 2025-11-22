import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from '../service/mate.service.js';

/**
 * Obtener todos los productos
 */
export async function getAllProductsController(req, res) {
  try {
    const { name } = req.query;
    const products = await getAllProducts(name);
    res.status(200).json(products?.products || products);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrió un error obteniendo los productos.',
      error: error.message,
    });
  }
}

/**
 * Crear un producto
 */
export async function createProductController(req, res) {
  try {
    const productData = req.body;

    // Validación básica
    if (!productData.name || !productData.category) {
      return res.status(400).json({
        mensaje: 'El nombre y la categoría son campos obligatorios.',
      });
    }

    // Generar URL completa si se subió un archivo
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      productData.image = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      productData.image = req.body.imageUrl;
    }

    // Si no se proporcionó imagen de ninguna forma
    if (!productData.image) {
      return res.status(400).json({
        mensaje: 'Debe proporcionar una imagen (archivo o URL).',
      });
    }

    // Crear producto
    const product = await createProduct(productData);

    res.status(201).json({
      mensaje: 'Producto creado exitosamente.',
      producto: product,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrió un error creando el producto.',
      error: error.message,
    });
  }
}

/**
 * Actualizar un producto
 */
export async function updateProductController(req, res) {
  try {
    const { id } = req.params;
    const productData = req.body;

    // Generar URL completa si se subió un archivo nuevo
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      productData.image = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      productData.image = req.body.imageUrl;
    }

    const product = await updateProduct(id, productData);

    res.status(200).json({
      mensaje: 'Producto actualizado correctamente.',
      producto: product,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrió un error actualizando el producto.',
      error: error.message,
    });
  }
}

/**
 * Eliminar un producto
 */
export async function deleteProductController(req, res) {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Ocurrió un error eliminando el producto.',
      error: error.message,
    });
  }
}

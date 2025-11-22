import Product from '../model/mates.model.js';

/**
 * Obtener todos los productos, opcionalmente filtrando por nombre o descripción
 */
export async function getAllProducts(name) {
    try {
        const filter = name
            ? {
                $or: [
                    { name: { $regex: name, $options: 'i' } },
                    { description: { $regex: name, $options: 'i' } },
                ],
            }
            : {};

        return await Product.find(filter);
    } catch (error) {
        throw new Error('Error obteniendo productos: ' + error.message);
    }
}

/**
 * Crear un producto nuevo
 */
export async function createProduct(productData) {
    try {
        // Validación mínima a nivel de servicio
        if (!productData.name || !productData.category || !productData.image) {
            throw new Error('Faltan datos obligatorios: nombre, categoría o imagen.');
        }

        const product = new Product(productData);
        return await product.save();
    } catch (error) {
        throw new Error('Error creando producto: ' + error.message);
    }
}

/**
 * Actualizar un producto existente
 */
export async function updateProduct(id, data) {
    try {
        const sanitizedData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        const product = await Product.findByIdAndUpdate(id, sanitizedData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            throw new Error('Producto no encontrado.');
        }

        return product;
    } catch (error) {
        throw new Error('Error actualizando producto: ' + error.message);
    }
}

/**
 * Eliminar un producto por ID
 */
export async function deleteProduct(id) {
    try {
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            throw new Error('Producto no encontrado.');
        }

        return result;
    } catch (error) {
        throw new Error('Error eliminando producto: ' + error.message);
    }
}

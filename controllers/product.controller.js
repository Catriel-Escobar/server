import productService from '../services/product.service.js';
import { createAppError } from '../utils/createAppError.js';

export const createProduct = async (req, res, next) => {
  try {
    const errors = validateProducto(req.body);
    if (errors.length > 0) {
      throw createAppError(400, 'Error de validación', 'validation', errors);
    }

    const newProduct = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { categoria } = req.query;
    const products = await productService.getAllProducts(categoria);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (isNaN(parseInt(id))) {
      throw createAppError(400, 'ID debe ser un número válido', 'validation');
    }

    const errors = validateProducto(req.body);
    if (errors.length > 0) {
      throw createAppError(400, 'Error de validación', 'validation', errors);
    }

    const updatedProduct = await productService.updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (isNaN(parseInt(id))) {
      throw createAppError(400, 'ID debe ser un número válido', 'validation');
    }

    const result = await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

function validateProducto(body) {
  const { nombre, descripcion, precio, categoria, imagenUrl } = body;

  const errors = [];

  if (!nombre || typeof nombre !== 'string') {
    errors.push({
      field: 'nombre',
      message: 'El nombre es obligatorio y debe ser un string.',
    });
  }

  if (!descripcion || typeof descripcion !== 'string') {
    errors.push({
      field: 'descripcion',
      message: 'La descripción es obligatoria y debe ser un string.',
    });
  }

  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    errors.push({
      field: 'precio',
      message: 'El precio es obligatorio y debe ser un número mayor que 0.',
    });
  }

  if (!categoria || typeof categoria !== 'string') {
    errors.push({
      field: 'categoria',
      message: 'La categoría es obligatoria y debe ser un string.',
    });
  }

  if (
    imagenUrl !== undefined &&
    imagenUrl !== null &&
    typeof imagenUrl !== 'string'
  ) {
    errors.push({
      field: 'imagenUrl',
      message: 'La URL de imagen debe ser un string.',
    });
  }

  return errors;
}

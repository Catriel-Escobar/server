import prisma from '../config/prisma.js';
import { NotFoundError, InternalServerError } from '../utils/errors.js';

// Servicio para productos
const productService = {
  // Obtener todos los productos
  getAllProducts: async (categoria = null) => {
    try {
      const where = {};
      if (categoria) {
        where.categoria = {
          equals: categoria,
          mode: 'insensitive',
        };
      }

      const products = await prisma.producto.findMany({ where });

      if (!products || products.length === 0) {
        throw new NotFoundError('No se encontraron productos', 'PRODUCTS_NOT_FOUND');
      }

      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(
        'Error al obtener productos',
        'PRODUCTS_FETCH_ERROR'
      );
    }
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    try {
      const product = await prisma.producto.findUnique({
        where: { id: parseInt(id) },
      });

      if (!product) {
        throw new NotFoundError('Producto no encontrado', 'PRODUCT_NOT_FOUND');
      }

      return product;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(
        'Error al obtener producto',
        'PRODUCT_FETCH_ERROR'
      );
    }
  },

  // Crear un producto
  createProduct: async (productData) => {
    try {
      const { nombre, descripcion, precio, categoria, imagenUrl } = productData;

      const newProduct = await prisma.producto.create({
        data: { nombre, descripcion, precio, categoria, imagenUrl },
      });

      return newProduct;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new InternalServerError(
        'Error al crear producto',
        'PRODUCT_CREATE_ERROR'
      );
    }
  },

  // Actualizar un producto
  updateProduct: async (id, productData) => {
    try {
      const { nombre, descripcion, precio, categoria, imagenUrl } = productData;

      // Verificar si el producto existe
      const existingProduct = await prisma.producto.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingProduct) {
        throw new NotFoundError('Producto no encontrado', 'PRODUCT_NOT_FOUND');
      }

      // Actualizar el producto
      const updatedProduct = await prisma.producto.update({
        where: { id: parseInt(id) },
        data: { nombre, descripcion, precio, categoria, imagenUrl },
      });

      return updatedProduct;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(
        'Error al actualizar producto',
        'PRODUCT_UPDATE_ERROR'
      );
    }
  },

  // Eliminar un producto
  deleteProduct: async (id) => {
    try {
      // Verificar si el producto existe
      const existingProduct = await prisma.producto.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingProduct) {
        throw new NotFoundError('Producto no encontrado', 'PRODUCT_NOT_FOUND');
      }

      // Eliminar el producto
      await prisma.producto.delete({
        where: { id: parseInt(id) },
      });

      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(
        'Error al eliminar producto',
        'PRODUCT_DELETE_ERROR'
      );
    }
  },
};

export default productService;

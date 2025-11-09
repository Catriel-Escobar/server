import prisma from '../config/prisma.js';
import { NotFoundError, InternalServerError } from '../utils/errors.js';

// Servicio para mesas
const mesaService = {
  // Obtener todas las mesas
  getAllMesas: async (estado = null) => {
    try {
      const where = {};
      if (estado) {
        where.estado = estado.toUpperCase();
      }

      const mesas = await prisma.mesa.findMany({ where });

      if (!mesas || mesas.length === 0) {
        throw new NotFoundError('No se encontraron mesas', 'MESAS_NOT_FOUND');
      }

      return mesas;
    } catch (error) {
      console.error('Error al obtener mesas:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Error al obtener mesas', 'MESAS_FETCH_ERROR');
    }
  },

  // Obtener una mesa por ID
  getMesaById: async (id) => {
    try {
      const mesa = await prisma.mesa.findUnique({
        where: { id: parseInt(id) },
        include: {
          pedidos: true,
        },
      });

      if (!mesa) {
        throw new NotFoundError('Mesa no encontrada', 'MESA_NOT_FOUND');
      }

      return mesa;
    } catch (error) {
      console.error('Error al obtener mesa:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Error al obtener mesa', 'MESA_FETCH_ERROR');
    }
  },

  // Crear una mesa
  createMesa: async (mesaData) => {
    try {
      const { numero, locacion, estado, capacity } = mesaData;

      const newMesa = await prisma.mesa.create({
        data: {
          numero,
          locacion,
          estado: estado ? estado.toUpperCase() : 'HABILITADO',
          capacity: capacity != null ? parseInt(capacity, 10) : undefined,
        },
      });

      return newMesa;
    } catch (error) {
      console.error('Error al crear mesa:', error);
      throw new InternalServerError('Error al crear mesa', 'MESA_CREATE_ERROR');
    }
  },

  // Actualizar una mesa
  updateMesa: async (id, mesaData) => {
    try {
      const { numero, locacion, estado, capacity } = mesaData;

      // Verificar si la mesa existe
      const existingMesa = await prisma.mesa.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingMesa) {
        throw new NotFoundError('Mesa no encontrada', 'MESA_NOT_FOUND');
      }

      // Preparar datos para actualizar
      const updateData = {};
      if (numero !== undefined) updateData.numero = numero;
      if (locacion !== undefined) updateData.locacion = locacion;
      if (estado !== undefined) updateData.estado = estado.toUpperCase();
      if (capacity !== undefined) updateData.capacity = parseInt(capacity, 10);

      // Actualizar la mesa
      const updatedMesa = await prisma.mesa.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return updatedMesa;
    } catch (error) {
      console.error('Error al actualizar mesa:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Error al actualizar mesa', 'MESA_UPDATE_ERROR');
    }
  },

  // Eliminar una mesa
  deleteMesa: async (id) => {
    try {
      // Verificar si la mesa existe
      const existingMesa = await prisma.mesa.findUnique({
        where: { id: parseInt(id) },
        include: {
          pedidos: true,
        },
      });

      if (!existingMesa) {
        throw new NotFoundError('Mesa no encontrada', 'MESA_NOT_FOUND');
      }

      // Verificar si la mesa tiene pedidos asociados
      if (existingMesa.pedidos && existingMesa.pedidos.length > 0) {
        throw new InternalServerError(
          'No se puede eliminar la mesa porque tiene pedidos asociados',
          'MESA_HAS_ORDERS'
        );
      }

      // Eliminar la mesa
      await prisma.mesa.delete({
        where: { id: parseInt(id) },
      });

      return { message: 'Mesa eliminada exitosamente' };
    } catch (error) {
      console.error('Error al eliminar mesa:', error);
      if (error instanceof NotFoundError || error instanceof InternalServerError) {
        throw error;
      }
      throw new InternalServerError('Error al eliminar mesa', 'MESA_DELETE_ERROR');
    }
  },
};

export default mesaService;

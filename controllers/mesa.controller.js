import mesaService from '../services/mesa.service.js';
import { createAppError } from '../utils/createAppError.js';

export const createMesa = async (req, res, next) => {
  try {
    const errors = validateMesa(req.body);
    if (errors.length > 0) {
      throw createAppError(400, 'Error de validación', 'validation', errors);
    }

    const newMesa = await mesaService.createMesa(req.body);

    res.status(201).json({
      success: true,
      message: 'Mesa creada exitosamente',
      mesa: newMesa,
    });
  } catch (error) {
    next(error);
  }
};

export const getMesas = async (req, res, next) => {
  try {
    const { estado } = req.query;
    const mesas = await mesaService.getAllMesas(estado);

    res.status(200).json({
      success: true,
      data: mesas,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMesas = async (req, res, next) => {
  try {
    const estado = req.query.estado ?? null;
    const mesas = await mesaService.getAllMesas(estado);
    // devolver todo (incluye capacity)
    res.json({ success: true, data: mesas });
  } catch (err) {
    next(err);
  }
};

export const getMesaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (isNaN(parseInt(id))) {
      throw createAppError(400, 'ID debe ser un número válido', 'validation');
    }

    const mesa = await mesaService.getMesaById(id);

    res.status(200).json({
      success: true,
      data: mesa,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMesa = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (isNaN(parseInt(id))) {
      throw createAppError(400, 'ID debe ser un número válido', 'validation');
    }

    const errors = validateMesa(req.body, true);
    if (errors.length > 0) {
      throw createAppError(400, 'Error de validación', 'validation', errors);
    }

    const updatedMesa = await mesaService.updateMesa(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Mesa actualizada exitosamente',
      mesa: updatedMesa,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMesa = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (isNaN(parseInt(id))) {
      throw createAppError(400, 'ID debe ser un número válido', 'validation');
    }

    const result = await mesaService.deleteMesa(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

function validateMesa(body, isUpdate = false) {
  const { numero, locacion, estado } = body;

  const errors = [];

  if (!isUpdate || numero !== undefined) {
    if (numero === undefined || typeof numero !== 'number' || numero <= 0) {
      errors.push({
        field: 'numero',
        message: 'El número es obligatorio y debe ser un número mayor que 0.',
      });
    }
  }

  if (!isUpdate || locacion !== undefined) {
    if (!locacion || typeof locacion !== 'string') {
      errors.push({
        field: 'locacion',
        message: 'La ubicación es obligatoria y debe ser un string.',
      });
    }
  }

  if (estado !== undefined) {
    const estadosValidos = ['HABILITADO', 'OCUPADO', 'RESERVADO'];
    if (
      typeof estado !== 'string' ||
      !estadosValidos.includes(estado.toUpperCase())
    ) {
      errors.push({
        field: 'estado',
        message: `El estado debe ser uno de: ${estadosValidos.join(', ')}.`,
      });
    }
  }

  return errors;
}

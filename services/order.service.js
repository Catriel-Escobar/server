import prisma from '../config/prisma.js';
import { createAppError } from '../utils/createAppError.js';

export async function createPedido({ idMesa, nombre, email, estado, fechaHora }) {
  // Valida los campos
  await validatePedido({ idMesa, nombre, email, estado, fechaHora });
  //  Crea el pedido
  return await prisma.pedido.create({
    data: { idMesa, nombre, email, estado, fechaHora },
  });
}

export async function updateEstadoPedido(idPedido, nuevoEstado) {
  if (!idPedido || isNaN(idPedido)) {
    throw createAppError(
      400,
      'El id del pedido debe ser un número válido',
      'validation'
    );
  }

  if (!nuevoEstado || typeof nuevoEstado !== 'string') {
    throw createAppError(400, 'El nuevo estado es obligatorio', 'validation');
  }

  // verificar que el pedido exista
  const pedidoExists = await prisma.pedido.findUnique({ where: { id: idPedido } });
  if (!pedidoExists) {
    throw createAppError(404, `El pedido con id ${idPedido} no existe`, 'not_found');
  }

  // actualizar el estado
  const updatedPedido = await prisma.pedido.update({
    where: { id: idPedido },
    data: { estado: nuevoEstado },
  });

  return updatedPedido;
}

export async function getPedidosPorEstado(estado) {
  const where = {};

  if (estado) {
    where.estado = estado.toUpperCase(); // si tus enums son en mayúsculas
  }

  const pedidos = await prisma.pedido.findMany({
    where,
    include: {
      detalles: {
        include: {
          productos: {
            include: {
              producto: true, // para traer los datos del producto
            },
          },
        },
      },
      pagos: true,
      mesa: true, // si querés traer info de la mesa
    },
  });

  return pedidos;
}

export async function validatePedido({ idMesa, nombre, email, estado, fechaHora }) {
  if (!idMesa || isNaN(idMesa)) {
    throw createAppError(
      400,
      'El id de la mesa es obligatorio y debe ser un número',
      'validation'
    );
  }

  if (!nombre || typeof nombre !== 'string') {
    throw createAppError(
      400,
      'El nombre del cliente es obligatorio y debe ser un string',
      'validation'
    );
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw createAppError(
      400,
      'El email del cliente es obligatorio y debe ser válido',
      'validation'
    );
  }

  if (!estado || typeof estado !== 'string') {
    throw createAppError(400, 'El estado del pedido es obligatorio', 'validation');
  }

  if (!fechaHora || isNaN(new Date(fechaHora).getTime())) {
    throw createAppError(
      400,
      'La fecha y hora del pedido son inválidas',
      'validation'
    );
  }

  // Verificar que la mesa exista
  const mesaExists = await prisma.mesa.findUnique({ where: { id: idMesa } });
  if (!mesaExists) {
    throw createAppError(404, `La mesa con id ${idMesa} no existe`, 'not_found');
  }
}

export async function listOrders() {
  return prisma.pedido.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      mesa: true,
      usuario: true,
      detalles: {
        include: { producto: true },
      },
    },
  })
}

import prisma from '../config/prisma.js';

export async function createPago({ idPedido, metodo, estado, monto }) {
  return prisma.pago.create({
    data: {
      idPedido,
      metodo,
      estado,
      monto,
    },
  });
}

export async function getTodayTotal() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const pagos = await prisma.pago.findMany({
    where: {
      estado: 'CONFIRMADO',
      pedido: {
        fechaHora: { gte: start, lte: end },
      },
    },
    select: { monto: true },
  });

  return pagos.reduce((total, pago) => total + Number(pago.monto || 0), 0);
}

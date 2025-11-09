import prisma from '../config/prisma.js';

export async function createDetallePedido({ idPedido, items }) {
  // items = [{ idProducto, quantity, price }]

  const detallePromises = items.map((item) =>
    prisma.detallePedido.create({
      data: {
        idPedido,
        cantidad: item.quantity,
        subtotal: item.price * item.quantity,
        productos: {
          create: [
            {
              idProducto: parseInt(item.idProducto),
            },
          ],
        },
      },
      include: { productos: true },
    })
  );

  // ejecuta todas las promesas en paralelo
  const detalles = await Promise.all(detallePromises);

  return detalles;
}

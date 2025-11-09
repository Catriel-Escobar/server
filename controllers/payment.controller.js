import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import {
  PORT,
  MERCADOPAGO_ACCESS_TOKEN,
  MERCADOPAGO_BASE_URL,
  MERCADOPAGO_NOTIFY_URL,
  FRONTEND_URL,
} from '../routes/config.js';
import { createAppError } from '../utils/createAppError.js';
import {
  createPedido,
  getPedidosPorEstado,
  updateEstadoPedido,
} from '../services/order.service.js';
import { createDetallePedido } from '../services/detail-order.service.js';
import { createPago, getTodayTotal } from '../services/payment.service.js';

const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_ACCESS_TOKEN,
});

export const createOrder = async (req, res) => {
  try {
    console.log('createOrder request body:', JSON.stringify(req.body));
    const { items: rawItems, payer: rawPayer } = req.body || {};

    // Validación básica
    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ error: 'No se recibieron items en el pedido' });
    }

    // Normaliza los items al formato que espera MercadoPago
    const items = rawItems.map((it) => {
      const title = it.title || it.name || 'Producto';
      const quantity = Number(it.quantity ?? 1);
      const unit_price = Number(it.unit_price ?? it.price ?? it.unitPrice ?? 0);
      return { title, unit_price, quantity };
    });

    const preference = new Preference(client);

    // Determinar baseUrl desde config (seguro)
    let baseUrl = MERCADOPAGO_BASE_URL;
    if (!baseUrl && MERCADOPAGO_NOTIFY_URL) {
      try {
        baseUrl = new URL(MERCADOPAGO_NOTIFY_URL).origin;
      } catch (err) {
        console.warn(
          'MERCADOPAGO_NOTIFY_URL inválida:',
          MERCADOPAGO_NOTIFY_URL,
          err
        );
      }
    }
    baseUrl = baseUrl || 'https://proyecto-final-pp-4.vercel.app';

    const result = await preference.create({
      body: {
        items,
        payer: rawPayer ? { email: rawPayer.email } : undefined,
        back_urls: {
          success: `${FRONTEND_URL}/success?status=approved&payment_id=${
            req.query.payment_id || req.query.collection_id
          }`,
          failure: `${FRONTEND_URL}/failure?status=rejected`,
          pending: `${FRONTEND_URL}/pending?status=pending`,
        },
        notification_url: MERCADOPAGO_NOTIFY_URL || `${baseUrl}/payments/webhook`, // Webhook sigue al backend
        auto_return: 'approved',
      },
    });

    console.log(result);

    // Asegurarse de enviar JSON y confirmar tamaño para depuración
    const bodyToSend = result?.body ?? result;
    try {
      const bodyStr = JSON.stringify(bodyToSend);
      console.log('Enviando respuesta createOrder, bytes:', bodyStr.length);
      res.status(200).json(bodyToSend);
    } catch (err) {
      console.error('Error serializando bodyToSend:', err);
      // fallback: enviar mensaje mínimo
      res.status(200).json({ init_point: bodyToSend.init_point ?? null });
    }
  } catch (error) {
    console.error('Error en createOrder - full error:', error);
    console.error('Error.response?.data:', error?.response?.data);
    const errBody = error?.response?.data || {
      message: error?.message || 'Error interno',
    };
    res.status(500).json({ error: errBody });
  }
};

export const receiveWebhook = async (req, res) => {
  try {
    const { query } = req;

    const paymentId = query['data.id'] || query.id;
    const topic = query.type || query.topic;

    if (topic === 'payment') {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });
      console.log('Payment data:', paymentData);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

export const success = (req, res) => {
  const paymentId = req.query.payment_id || req.query.collection_id;
  res.redirect(`${FRONTEND_URL}/success?status=approved&payment_id=${paymentId}`);
};

export const failure = (req, res) => {
  res.redirect(`${FRONTEND_URL}/failure?status=rejected`);
};

export const pending = (req, res) => {
  res.redirect(`${FRONTEND_URL}/pending?status=pending`);
};

export const webhook = (req, res) => res.json({ message: 'Webhook' });

export const createOrderDB = async (req, res, next) => {
  try {
    console.log('Body recibido:', req.body);
    const {
      mesa,
      usuario,
      fecha,
      hora,
      items,
      total,
      metodoPago,
      email,
      estadoPago,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw createAppError(
        400,
        'El pedido debe tener al menos un item',
        'validation'
      );
    }

    console.log('Creando pedido...');
    const pedido = await createPedido({
      idMesa: parseInt(mesa),
      nombre: usuario,
      email,
      estado: 'PENDIENTE',
      fechaHora: new Date(`${fecha} ${hora}`),
    });

    console.log('Creando detalles...');
    const detalles = await createDetallePedido({
      idPedido: pedido.id,
      items: items.map((i) => ({
        idProducto: i.id,
        quantity: i.quantity,
        price: i.price ?? i.precio,
      })),
    });

    console.log('Creando pago...');
    const pago = await createPago({
      idPedido: pedido.id,
      metodo: metodoPago.toUpperCase(),
      estado: estadoPago.toUpperCase(),
      monto: total,
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente',
      pedido: {
        ...pedido,
        detalles,
        pagos: [pago],
      },
    });
  } catch (error) {
    console.error('Error en createOrderDB:', error);
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedidoActualizado = await updateEstadoPedido(parseInt(id), estado);

    res.status(200).json({
      success: true,
      message: 'Estado del pedido actualizado correctamente',
      pedido: pedidoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

export const getPedidos = async (req, res, next) => {
  try {
    const { estado } = req.query; // /pedidos?estado=PENDIENTE
    const pedidos = await getPedidosPorEstado(estado);

    res.status(200).json({
      success: true,
      pedidos,
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayPayments = async (req, res, next) => {
  try {
    const total = await getTodayTotal();
    res.json({ total });
  } catch (error) {
    next(error);
  }
};

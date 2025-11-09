# Ejemplos de comandos curl para Pedidos

## Base URL

`http://localhost:3000/api/payments`

---

## 1. Crear Pedido (POST)

Este endpoint crea un pedido completo con detalles y pago.

```bash
curl -X POST http://localhost:3000/api/payments/create-order-db \
  -H "Content-Type: application/json" \
  -d '{
    "mesa": 1,
    "usuario": "Juan Pérez",
    "email": "juan.perez@example.com",
    "fecha": "2024-01-15",
    "hora": "14:30:00",
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": 1200
      },
      {
        "id": 2,
        "quantity": 1,
        "price": 1500
      }
    ],
    "total": 3900,
    "metodoPago": "EFECTIVO",
    "estadoPago": "PENDIENTE"
  }'
```

**Campos requeridos:**

- `mesa`: ID de la mesa (número)
- `usuario`: Nombre del cliente (string)
- `email`: Email del cliente (string válido)
- `fecha`: Fecha en formato "YYYY-MM-DD"
- `hora`: Hora en formato "HH:MM:SS"
- `items`: Array de items del pedido
  - `id`: ID del producto
  - `quantity`: Cantidad
  - `price`: Precio unitario
- `total`: Total del pedido (número)
- `metodoPago`: Método de pago (`EFECTIVO`, `TARJETA`, `APP`)
- `estadoPago`: Estado del pago (`PENDIENTE`, `CONFIRMADO`)

---

## 2. Obtener Todos los Pedidos (GET)

### Obtener todos los pedidos con toda la información

```bash
curl -X GET http://localhost:3000/api/payments/create-order-db
```

### Obtener pedidos filtrados por estado

```bash
curl -X GET "http://localhost:3000/api/payments/create-order-db?estado=PENDIENTE"
```

**Query params opcionales:**

- `estado`: Filtrar pedidos por estado (`PENDIENTE`, `PAGADO`, `EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`)

**Estados válidos de pedido:**

- `PENDIENTE` - Pedido recibido
- `PAGADO` - Pedido pagado
- `EN_PREPARACION` - En cocina
- `DESPACHADO` - Listo para entregar
- `ENTREGADO` - Entregado al cliente

**Respuesta incluye:**

- Información del pedido (id, cliente, mesa, estado, fecha/hora)
- Detalles del pedido (cantidad, subtotal)
- Productos incluidos (con toda la información del producto incluyendo imagenUrl)
- Información de pagos (método, estado, monto)
- Información de la mesa (número, ubicación, estado)

---

## 3. Actualizar Estado del Pedido (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "EN_PREPARACION"
  }'
```

**Parámetros:**

- `:id` - ID del pedido a actualizar
- `estado` - Nuevo estado del pedido (string)

**Estados válidos:**

- `PENDIENTE`
- `PAGADO`
- `EN_PREPARACION`
- `DESPACHADO`
- `ENTREGADO`

---

## 4. Crear Orden para MercadoPago (POST)

Este endpoint crea una preferencia de pago en MercadoPago.

```bash
curl -X POST http://localhost:3000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Hamburguesa Clásica",
        "quantity": 2,
        "unit_price": 1200
      },
      {
        "title": "Pizza Margarita",
        "quantity": 1,
        "unit_price": 1500
      }
    ],
    "payer": {
      "email": "cliente@example.com"
    }
  }'
```

**Campos requeridos:**

- `items`: Array de items del pedido
  - `title`: Nombre del producto
  - `quantity`: Cantidad
  - `unit_price`: Precio unitario
- `payer`: Información del pagador (opcional)
  - `email`: Email del pagador

---

## Ejemplos de Uso Común

### Crear pedido con pago en efectivo

```bash
curl -X POST http://localhost:3000/api/payments/create-order-db \
  -H "Content-Type: application/json" \
  -d '{
    "mesa": 1,
    "usuario": "María González",
    "email": "maria@example.com",
    "fecha": "2024-01-15",
    "hora": "19:00:00",
    "items": [
      {
        "id": 1,
        "quantity": 1,
        "price": 1200
      }
    ],
    "total": 1200,
    "metodoPago": "EFECTIVO",
    "estadoPago": "CONFIRMADO"
  }'
```

### Crear pedido con pago con tarjeta

```bash
curl -X POST http://localhost:3000/api/payments/create-order-db \
  -H "Content-Type: application/json" \
  -d '{
    "mesa": 2,
    "usuario": "Carlos Rodríguez",
    "email": "carlos@example.com",
    "fecha": "2024-01-15",
    "hora": "20:30:00",
    "items": [
      {
        "id": 2,
        "quantity": 2,
        "price": 1500
      },
      {
        "id": 3,
        "quantity": 1,
        "price": 1000
      }
    ],
    "total": 4000,
    "metodoPago": "TARJETA",
    "estadoPago": "CONFIRMADO"
  }'
```

### Cambiar estado de pedido a "En Preparación"

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "EN_PREPARACION"
  }'
```

### Cambiar estado de pedido a "Despachado"

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "DESPACHADO"
  }'
```

### Cambiar estado de pedido a "Entregado"

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "ENTREGADO"
  }'
```

### Obtener solo pedidos pendientes

```bash
curl -X GET "http://localhost:3000/api/payments/create-order-db?estado=PENDIENTE"
```

### Obtener solo pedidos en preparación

```bash
curl -X GET "http://localhost:3000/api/payments/create-order-db?estado=EN_PREPARACION"
```

### Obtener solo pedidos despachados

```bash
curl -X GET "http://localhost:3000/api/payments/create-order-db?estado=DESPACHADO"
```

---

## Flujo Típico de un Pedido

### 1. Crear el pedido (estado inicial: PENDIENTE)

```bash
curl -X POST http://localhost:3000/api/payments/create-order-db \
  -H "Content-Type: application/json" \
  -d '{
    "mesa": 1,
    "usuario": "Cliente Ejemplo",
    "email": "cliente@example.com",
    "fecha": "2024-01-15",
    "hora": "12:00:00",
    "items": [
      {
        "id": 1,
        "quantity": 1,
        "price": 1200
      }
    ],
    "total": 1200,
    "metodoPago": "EFECTIVO",
    "estadoPago": "PENDIENTE"
  }'
```

### 2. Confirmar pago y cambiar a PAGADO

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "PAGADO"
  }'
```

### 3. Enviar a cocina (EN_PREPARACION)

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "EN_PREPARACION"
  }'
```

### 4. Listo para entregar (DESPACHADO)

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "DESPACHADO"
  }'
```

### 5. Entregado al cliente (ENTREGADO)

```bash
curl -X PATCH http://localhost:3000/api/payments/create-order-db/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "ENTREGADO"
  }'
```

---

## Notas

- Reemplaza `localhost:3000` con la URL de tu servidor si está desplegado
- Los IDs de productos deben existir en la base de datos
- Los IDs de mesa deben existir en la base de datos
- El formato de fecha y hora debe ser exacto como se muestra en los ejemplos
- Los estados deben estar en mayúsculas
- Los métodos de pago deben estar en mayúsculas: `EFECTIVO`, `TARJETA`, `APP`
- Los estados de pago deben estar en mayúsculas: `PENDIENTE`, `CONFIRMADO`

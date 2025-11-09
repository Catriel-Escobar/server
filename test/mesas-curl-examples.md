# Ejemplos de comandos curl para Mesas (CRUD)

## Base URL

`http://localhost:3000/api/mesas`

---

## 1. Crear Mesa (POST)

```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 6,
    "locacion": "Terraza",
    "estado": "HABILITADO"
  }'
```

**Campos requeridos:**

- `numero`: Número de la mesa (número entero mayor que 0)
- `locacion`: Ubicación de la mesa (string, ej: "Interior", "Terraza", "Ventana")
- `estado`: Estado de la mesa (opcional, por defecto "HABILITADO")

**Estados válidos:**

- `HABILITADO`
- `OCUPADO`
- `RESERVADO`

---

## 2. Obtener Todas las Mesas (GET)

```bash
# Obtener todas las mesas
curl -X GET http://localhost:3000/api/mesas

# Obtener mesas filtradas por estado
curl -X GET "http://localhost:3000/api/mesas?estado=HABILITADO"
```

**Query params opcionales:**

- `estado`: Filtrar mesas por estado (`HABILITADO`, `OCUPADO`, `RESERVADO`)

---

## 3. Obtener Mesa por ID (GET)

```bash
curl -X GET http://localhost:3000/api/mesas/1
```

**Parámetros:**

- `:id` - ID de la mesa (número)

**Respuesta incluye:**

- Información de la mesa (id, numero, locacion, estado)
- Pedidos asociados (si existen)

---

## 4. Actualizar Mesa (PUT)

```bash
curl -X PUT http://localhost:3000/api/mesas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 1,
    "locacion": "Interior",
    "estado": "OCUPADO"
  }'
```

**Campos opcionales (puedes actualizar solo los que necesites):**

- `numero`: Nuevo número de la mesa (número entero mayor que 0)
- `locacion`: Nueva ubicación de la mesa (string)
- `estado`: Nuevo estado de la mesa (`HABILITADO`, `OCUPADO`, `RESERVADO`)

**Ejemplo: Actualizar solo el estado**

```bash
curl -X PUT http://localhost:3000/api/mesas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "RESERVADO"
  }'
```

---

## 5. Eliminar Mesa (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/mesas/1
```

**Parámetros:**

- `:id` - ID de la mesa a eliminar (número)

**Nota:** No se puede eliminar una mesa que tenga pedidos asociados.

---

## Ejemplos de Uso Común

### Cambiar estado de mesa a OCUPADO

```bash
curl -X PUT http://localhost:3000/api/mesas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "OCUPADO"
  }'
```

### Reservar una mesa

```bash
curl -X PUT http://localhost:3000/api/mesas/3 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "RESERVADO"
  }'
```

### Liberar una mesa (volver a HABILITADO)

```bash
curl -X PUT http://localhost:3000/api/mesas/2 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "HABILITADO"
  }'
```

### Obtener solo mesas disponibles

```bash
curl -X GET "http://localhost:3000/api/mesas?estado=HABILITADO"
```

### Obtener solo mesas ocupadas

```bash
curl -X GET "http://localhost:3000/api/mesas?estado=OCUPADO"
```

---

## Notas

- Reemplaza `localhost:3000` con la URL de tu servidor si está desplegado
- Los estados deben estar en mayúsculas
- El número de mesa debe ser único (aunque esto no está validado a nivel de base de datos en este momento)
- No puedes eliminar una mesa si tiene pedidos asociados

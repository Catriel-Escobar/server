# Sistema de Gestión de Restaurante - Backend

Este es el backend para el Sistema de Gestión de Restaurante, desarrollado con Node.js, Express y Prisma ORM con PostgreSQL. El proyecto utiliza módulos ES (ECMAScript) en lugar de CommonJS.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

## Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto-Final-PP4/server
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

El archivo `.env` ya está configurado con los valores predeterminados para desarrollo local. Si necesitas personalizarlo, puedes modificar las siguientes variables:

```
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
```

## Iniciar la Base de Datos

### 1. Levantar el Contenedor de PostgreSQL

```bash
docker-compose up -d
```

Esto iniciará un contenedor de PostgreSQL con las credenciales configuradas en el archivo `.env`.

### 2. Ejecutar Migraciones de Prisma

Para crear las tablas en la base de datos según el esquema definido:

```bash
npm run prisma:migrate
```

Para generar el cliente de Prisma:

```bash
npm run prisma:migrate
```

### 3. (Opcional) Explorar la Base de Datos con Prisma Studio

```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde podrás explorar y modificar los datos.

## Iniciar el Servidor

### Modo Desarrollo (con recarga automática)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

- `/config` - Configuraciones del servidor
- `/controllers` - Controladores para manejar las solicitudes HTTP
- `/prisma` - Esquema de Prisma y migraciones
- `/routes` - Definición de rutas de la API
- `/services` - Lógica de negocio
- `/utils` - Utilidades y funciones auxiliares

## Modelos de Datos

El sistema incluye los siguientes modelos principales:

- **User**: Usuarios del sistema con autenticación
- **Usuario**: Personal del restaurante (meseros, cocineros, etc.)
- **Mesa**: Mesas del restaurante
- **Producto**: Productos/platos disponibles
- **Pedido**: Órdenes realizadas por los clientes
- **DetallePedido**: Detalles de cada pedido
- **ProductoDetallePedido**: Relación entre productos y detalles de pedidos
- **Pago**: Registro de pagos realizados

## API Endpoints

- `GET /` - Verificar que la API está funcionando
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear un nuevo usuario
- `PUT /api/users/:id` - Actualizar un usuario existente

### Probar la API

Puedes usar herramientas como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/) para probar los endpoints de la API. También puedes usar curl desde la línea de comandos.

## Comandos Útiles

- `npm run dev` - Inicia el servidor en modo desarrollo con recarga automática
- `npm start` - Inicia el servidor en modo producción
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Ejecuta las migraciones pendientes
- `npm run prisma:studio` - Abre Prisma Studio para explorar la base de datos

## Solución de Problemas Comunes

### Error de conexión a la base de datos

Si encuentras errores de conexión a la base de datos:

1. Verifica que el contenedor de Docker esté en ejecución: `docker ps`
2. Asegúrate de que las credenciales en el archivo `.env` coincidan con las del `docker-compose.yml`
3. Intenta reiniciar el contenedor: `docker-compose down && docker-compose up -d`

### Error al ejecutar migraciones

Si las migraciones fallan:

1. Asegúrate de que la base de datos esté en ejecución
2. Verifica que no haya errores de sintaxis en el esquema de Prisma
3. Intenta ejecutar: `npx prisma migrate reset` (¡CUIDADO! Esto eliminará todos los datos)

## Consideraciones de Seguridad

- El archivo `.env` contiene información sensible. No lo incluyas en el control de versiones.
- Las contraseñas de los usuarios se almacenan hasheadas utilizando bcrypt.
- La API utiliza JWT (JSON Web Tokens) para la autenticación.

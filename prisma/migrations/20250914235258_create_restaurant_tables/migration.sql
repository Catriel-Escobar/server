-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."RolUsuario" AS ENUM ('MESERO', 'COCINERO', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."EstadoPedido" AS ENUM ('PENDIENTE', 'PAGADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO');

-- CreateEnum
CREATE TYPE "public"."MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'APP');

-- CreateEnum
CREATE TYPE "public"."EstadoPago" AS ENUM ('PENDIENTE', 'CONFIRMADO');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "public"."RolUsuario" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."mesas" (
    "id_mesa" SERIAL NOT NULL,
    "codigo_qr" TEXT NOT NULL,

    CONSTRAINT "mesas_pkey" PRIMARY KEY ("id_mesa")
);

-- CreateTable
CREATE TABLE "public"."productos" (
    "id_producto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "public"."pedidos" (
    "id_pedido" SERIAL NOT NULL,
    "id_cliente" INTEGER,
    "id_mesa" INTEGER NOT NULL,
    "estado" "public"."EstadoPedido" NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "public"."detalle_pedidos" (
    "id_detalle" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "detalle_pedidos_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "public"."producto_detalle_pedidos" (
    "id_producto" INTEGER NOT NULL,
    "id_detalle" INTEGER NOT NULL,

    CONSTRAINT "producto_detalle_pedidos_pkey" PRIMARY KEY ("id_producto","id_detalle")
);

-- CreateTable
CREATE TABLE "public"."pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "metodo" "public"."MetodoPago" NOT NULL,
    "estado" "public"."EstadoPago" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "public"."mesas"("id_mesa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_pedidos" ADD CONSTRAINT "detalle_pedidos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "public"."pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."producto_detalle_pedidos" ADD CONSTRAINT "producto_detalle_pedidos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."producto_detalle_pedidos" ADD CONSTRAINT "producto_detalle_pedidos_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "public"."detalle_pedidos"("id_detalle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "public"."pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

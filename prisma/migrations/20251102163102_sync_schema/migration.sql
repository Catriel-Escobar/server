/*
  Warnings:

  - You are about to drop the `productos` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Estado" AS ENUM ('Disponible', 'Agotado', 'Proximamente');

-- DropForeignKey
ALTER TABLE "public"."producto_detalle_pedidos" DROP CONSTRAINT "producto_detalle_pedidos_id_producto_fkey";

-- DropTable
DROP TABLE "public"."productos";

-- CreateTable
CREATE TABLE "public"."Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "imagenUrl" TEXT,
    "categoria" TEXT,
    "estado" "public"."Estado" NOT NULL DEFAULT 'Disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."producto_detalle_pedidos" ADD CONSTRAINT "producto_detalle_pedidos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

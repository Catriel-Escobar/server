/*
  Warnings:

  - The values [DESPACHADO] on the enum `EstadoPedido` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EstadoPedido_new" AS ENUM ('PENDIENTE', 'PAGADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO');
ALTER TABLE "public"."pedidos" ALTER COLUMN "estado" TYPE "public"."EstadoPedido_new" USING ("estado"::text::"public"."EstadoPedido_new");
ALTER TYPE "public"."EstadoPedido" RENAME TO "EstadoPedido_old";
ALTER TYPE "public"."EstadoPedido_new" RENAME TO "EstadoPedido";
DROP TYPE "public"."EstadoPedido_old";
COMMIT;

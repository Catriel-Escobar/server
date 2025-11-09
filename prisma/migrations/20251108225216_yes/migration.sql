/*
  Warnings:

  - The values [APP] on the enum `MetodoPago` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MetodoPago_new" AS ENUM ('EFECTIVO', 'TARJETA', 'MERCADOPAGO');
ALTER TABLE "public"."pagos" ALTER COLUMN "metodo" TYPE "public"."MetodoPago_new" USING ("metodo"::text::"public"."MetodoPago_new");
ALTER TYPE "public"."MetodoPago" RENAME TO "MetodoPago_old";
ALTER TYPE "public"."MetodoPago_new" RENAME TO "MetodoPago";
DROP TYPE "public"."MetodoPago_old";
COMMIT;

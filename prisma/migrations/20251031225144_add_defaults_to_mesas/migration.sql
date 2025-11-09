/*
  Warnings:

  - You are about to drop the column `codigo_qr` on the `mesas` table. All the data in the column will be lost.
  - Added the required column `locacion` to the `mesas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `mesas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EstadoMesa" AS ENUM ('HABILITADO', 'OCUPADO', 'RESERVADO');

-- AlterTable
ALTER TABLE "public"."mesas" DROP COLUMN "codigo_qr",
ADD COLUMN     "estado" "public"."EstadoMesa" NOT NULL DEFAULT 'HABILITADO',
ADD COLUMN     "locacion" TEXT NOT NULL,
ADD COLUMN     "numero" INTEGER NOT NULL;

/*
  Warnings:

  - Added the required column `categoria` to the `productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."productos" ADD COLUMN     "categoria" TEXT NOT NULL;

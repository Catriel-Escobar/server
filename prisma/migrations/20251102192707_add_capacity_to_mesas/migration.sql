-- AlterTable
ALTER TABLE "public"."mesas" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 4,
ALTER COLUMN "locacion" DROP NOT NULL;

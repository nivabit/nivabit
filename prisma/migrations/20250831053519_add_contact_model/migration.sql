-- AlterTable
ALTER TABLE "public"."Contact" ADD COLUMN     "isread" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isreadAt" TIMESTAMP(3);

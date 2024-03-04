-- CreateEnum
CREATE TYPE "Type" AS ENUM ('PROFESSIONAL', 'SERVICE');

-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'PROFESSIONAL';

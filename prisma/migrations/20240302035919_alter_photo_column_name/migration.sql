/*
  Warnings:

  - You are about to drop the column `photo_base64` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `photo_base64` on the `service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "professional" DROP COLUMN "photo_base64",
ADD COLUMN     "photo_name" TEXT;

-- AlterTable
ALTER TABLE "service" DROP COLUMN "photo_base64",
ADD COLUMN     "photo_name" TEXT;

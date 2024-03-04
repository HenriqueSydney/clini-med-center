/*
  Warnings:

  - You are about to drop the column `pharse` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `pharse` on the `service` table. All the data in the column will be lost.
  - Added the required column `phrase` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phrase` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professional" DROP COLUMN "pharse",
ADD COLUMN     "phrase" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service" DROP COLUMN "pharse",
ADD COLUMN     "phrase" TEXT NOT NULL,
ADD COLUMN     "specialty" TEXT NOT NULL;

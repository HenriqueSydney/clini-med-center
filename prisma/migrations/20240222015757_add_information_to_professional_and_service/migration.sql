/*
  Warnings:

  - Added the required column `email` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharse` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualifications` to the `professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharse` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualifications` to the `service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "pharse" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "qualifications" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "pharse" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "qualifications" TEXT NOT NULL;

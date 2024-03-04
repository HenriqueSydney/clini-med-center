/*
  Warnings:

  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "service_appointment" DROP CONSTRAINT "service_appointment_service_id_fkey";

-- DropForeignKey
ALTER TABLE "service_appointment" DROP CONSTRAINT "service_appointment_user_id_fkey";

-- DropTable
DROP TABLE "service";

-- DropTable
DROP TABLE "service_appointment";

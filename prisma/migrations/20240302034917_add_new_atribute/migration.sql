-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "photo_base64" TEXT;

-- AlterTable
ALTER TABLE "professional_appointment" ADD COLUMN     "observation" TEXT;

-- AlterTable
ALTER TABLE "service" ADD COLUMN     "photo_base64" TEXT;

-- AlterTable
ALTER TABLE "service_appointment" ADD COLUMN     "observation" TEXT;

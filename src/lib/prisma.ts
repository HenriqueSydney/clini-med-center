import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient({
  log: [],
})

export default prisma
import "dotenv/config";
import { PrismaClient } from '@prisma/client'

// The standard client automatically reads DATABASE_URL from your .env
const prisma = new PrismaClient();

export { prisma }
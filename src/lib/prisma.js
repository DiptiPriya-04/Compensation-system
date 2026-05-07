import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development which can exhaust db connections
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

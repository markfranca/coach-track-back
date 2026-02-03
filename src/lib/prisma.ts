import { PrismaClient } from "../generated/prisma/client";

// @ts-expect-error - Prisma 7 type issue with constructor
const prisma = new PrismaClient();

export default prisma;
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const createPrismaClient = () => {
  const maxPoolSize = process.env.NODE_ENV === "production" ? 1 : 10;

  const adapter = new PrismaPg({
    connectionString,
    max: maxPoolSize,
  });

  return new PrismaClient({ adapter });
};

// if (!globalForPrisma.prisma) {
//   globalForPrisma.prisma = createPrismaClient();
// }

const prisma =
  process.env.NODE_ENV !== "production"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();

export { prisma };

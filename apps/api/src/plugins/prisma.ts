import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../config";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  // Pool size ceiling (max:10 per CONSTRAINTS.md) is set via DATABASE_URL query param:
  // postgresql://...?connection_limit=10
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  const prisma = new PrismaClient({
    adapter,
    log:
      fastify.log.level === "debug"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });

  await prisma.$connect();
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};

export default fp(prismaPlugin, { name: "prisma" });

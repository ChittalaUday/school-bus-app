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
  // pool size is capped via ?connection_limit=10 in DATABASE_URL, not here (see CONSTRAINTS.md)
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

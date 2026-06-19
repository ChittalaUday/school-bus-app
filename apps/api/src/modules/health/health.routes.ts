import { FastifyInstance } from "fastify";
import { env } from "../../config";

export async function registerHealthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (_req, reply) => {
    const [dbResult, redisResult] = await Promise.allSettled([
      fastify.prisma.$queryRaw`SELECT 1`,
      fastify.redis.ping(),
    ]);

    const healthy =
      dbResult.status === "fulfilled" && redisResult.status === "fulfilled";

    return reply.code(healthy ? 200 : 503).send({
      status: healthy ? "ok" : "degraded",
      version: "0.0.1",
      env: env.NODE_ENV,
      services: {
        database: dbResult.status === "fulfilled" ? "ok" : "error",
        redis: redisResult.status === "fulfilled" ? "ok" : "error",
      },
    });
  });
}

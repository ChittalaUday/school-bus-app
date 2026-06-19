import { FastifyInstance } from "fastify";
import { env } from "../../config";

export async function registerHealthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (req, reply) => {
    const [dbResult, redisResult] = await Promise.allSettled([
      fastify.prisma.$queryRaw`SELECT 1`,
      fastify.redis.ping(),
    ]);

    const healthy =
      dbResult.status === "fulfilled" && redisResult.status === "fulfilled";

    if (!healthy) {
      req.log.error({
        database: dbResult.status === "rejected" ? dbResult.reason : "ok",
        redis: redisResult.status === "rejected" ? redisResult.reason : "ok",
      }, "Health check degraded");
    }

    const status = healthy ? "ok" : "degraded";
    const code = healthy ? 200 : 503;

    if (env.NODE_ENV !== "production") {
      return reply.code(code).send({
        status,
        version: "0.0.1",
        env: env.NODE_ENV,
        services: {
          database: dbResult.status === "fulfilled" ? "ok" : "error",
          redis: redisResult.status === "fulfilled" ? "ok" : "error",
        },
      });
    }

    return reply.code(code).send({ status });
  });
}

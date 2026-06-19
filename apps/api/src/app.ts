import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import { env } from "./config";
import { AppError } from "./utils/errors";
import prismaPlugin from "./plugins/prisma";
import redisPlugin from "./plugins/redis";
import healthPlugin from "./modules/health/health.plugin";

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      ...(env.NODE_ENV !== "production" && {
        transport: { target: "pino-pretty", options: { colorize: true } },
      }),
    },
    requestIdLogLabel: "requestId",
    disableRequestLogging: false,
  });

  // Security + utility plugins
  await fastify.register(helmet);
  await fastify.register(cors, { origin: env.CORS_ORIGIN });
  await fastify.register(sensible);

  // Infrastructure plugins — order matches plugin load order in ARCHITECTURE.md
  await fastify.register(prismaPlugin);
  await fastify.register(redisPlugin);

  // Domain modules
  await fastify.register(healthPlugin);

  // Global error handler — all errors map to AppError; never leak internals
  fastify.setErrorHandler((error, req, reply) => {
    if (error instanceof AppError) {
      return reply
        .code(error.statusCode)
        .send({ error: { code: error.code, message: error.message } });
    }

    if (error.validation) {
      return reply
        .code(400)
        .send({ error: { code: "VALIDATION_ERROR", message: error.message } });
    }

    req.log.error({ err: error }, "Unhandled error");
    return reply
      .code(500)
      .send({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } });
  });

  return fastify;
}

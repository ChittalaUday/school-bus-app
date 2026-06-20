import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import { env } from "./config";
import { ErrorCode } from "@govexa/shared";
import { AppError } from "./utils/errors";
import prismaPlugin from "./plugins/prisma";
import redisPlugin from "./plugins/redis";
import rateLimitPlugin from "./plugins/rate-limit";
import authHookPlugin from "./plugins/auth-hook";
import healthPlugin from "./modules/health/health.plugin";
import authPlugin from "./modules/auth/auth.plugin";

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      ...(env.NODE_ENV !== "production" && {
        transport: { target: "pino-pretty", options: { colorize: true } },
      }),
      // redact sensitive headers so they never appear in log output
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
      ],
    },
    requestIdLogLabel: "requestId",
    disableRequestLogging: false,
    // 1MB cap prevents memory exhaustion on the 512MB container (see CONSTRAINTS.md)
    bodyLimit: 1_048_576,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    frameguard: { action: "deny" },
    noSniff: true,
    hsts: env.NODE_ENV === "production"
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
  });

  await fastify.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  });

  await fastify.register(sensible);
  await fastify.register(rateLimitPlugin);

  // order matters — prisma and redis must be available before domain modules load
  await fastify.register(prismaPlugin);
  await fastify.register(redisPlugin);
  await fastify.register(authHookPlugin);

  await fastify.register(healthPlugin);
  await fastify.register(authPlugin);

  fastify.setErrorHandler((error: FastifyError, req, reply) => {
    const isDev = env.NODE_ENV !== "production";

    // AppError: we control the code and message — safe to expose in all envs
    if (error instanceof AppError) {
      return reply
        .code(error.statusCode)
        .send({ error: { code: error.code, message: error.message } });
    }

    // Rate limiting — structured response, no raw Fastify internals
    if (error.statusCode === 429) {
      return reply.code(429).send({
        error: {
          code: ErrorCode.RATE_LIMIT_EXCEEDED,
          message: isDev ? error.message : "Too many requests",
        },
      });
    }

    // Fastify schema validation — field-level details only in dev
    // (field names + paths reveal request schema structure to clients in prod)
    if (error.validation) {
      return reply.code(400).send({
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: isDev ? error.message : "Invalid request",
          ...(isDev && { details: error.validation }),
        },
      });
    }

    // Unhandled — always log full error; never send internals to production clients
    req.log.error({ err: error }, "Unhandled error");
    return reply.code(500).send({
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: isDev ? error.message : "An unexpected error occurred",
        ...(isDev && { stack: error.stack }),
      },
    });
  });

  return fastify;
}

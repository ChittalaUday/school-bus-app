import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import { ErrorCode } from "@govexa/shared";
import { env } from "../config";

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: (_req, context) => ({
      error: {
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        message: `Too many requests. Retry after ${Math.ceil(context.ttl / 1000)}s`,
      },
    }),
    ...(env.NODE_ENV === "test" && { max: 0 }),
  });
};

export const rateLimitPresets = {
  // 10 req/min per IP — brute-force threshold from docs/standards/security.md
  auth: {
    max: 10,
    timeWindow: "1 minute",
  },
  // 60 req/min — matches the 3-second GPS broadcast interval × headroom
  tracking: {
    max: 60,
    timeWindow: "1 minute",
  },
} as const;

export default fp(rateLimitPlugin, { name: "rate-limit" });

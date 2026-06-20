import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import authRoutes from "./auth.routes";

const authPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authRoutes, { prefix: "/auth" });
};

export default fp(authPlugin, { name: "auth", dependencies: ["auth-hook", "prisma"] });

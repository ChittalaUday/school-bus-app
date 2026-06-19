import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { registerHealthRoutes } from "./health.routes";

const healthPlugin: FastifyPluginAsync = async (fastify) => {
  await registerHealthRoutes(fastify);
};

export default fp(healthPlugin, { name: "health" });

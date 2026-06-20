import type { FastifyPluginAsync } from "fastify";
import { Permission } from "@govexa/shared";
import { AuthService } from "./auth.service";
import {
  inviteUserBodySchema,
  acceptInvitationBodySchema,
  loginBodySchema,
  refreshBodySchema,
} from "./auth.schema";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AuthService(
    fastify.prisma,
    (payload) => fastify.jwt.sign(payload),
  );

  fastify.post(
    "/invite",
    {
      schema: { body: inviteUserBodySchema },
      preHandler: [fastify.requirePermission([Permission.MANAGE_USERS])],
    },
    async (req, reply) => {
      const { email, role } = req.body as { email: string; role: string };
      const result = await service.inviteUser(email, role as import("@govexa/shared").UserRole);
      return reply.code(201).send(result);
    },
  );

  fastify.post(
    "/accept",
    { schema: { body: acceptInvitationBodySchema } },
    async (req, reply) => {
      const { token, password } = req.body as { token: string; password: string };
      const result = await service.acceptInvitation(token, password);
      return reply.code(200).send(result);
    },
  );

  fastify.post(
    "/login",
    { schema: { body: loginBodySchema } },
    async (req, reply) => {
      const { email, password } = req.body as { email: string; password: string };
      const result = await service.login(email, password);
      return reply.code(200).send(result);
    },
  );

  fastify.post(
    "/refresh",
    { schema: { body: refreshBodySchema } },
    async (req, reply) => {
      const { refreshToken } = req.body as { refreshToken: string };
      const result = await service.refresh(refreshToken);
      return reply.code(200).send(result);
    },
  );

  fastify.post(
    "/logout",
    { schema: { body: refreshBodySchema } },
    async (req, reply) => {
      const { refreshToken } = req.body as { refreshToken: string };
      await service.logout(refreshToken);
      return reply.code(204).send();
    },
  );

};

export default authRoutes;

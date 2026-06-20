import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { RolePermissions, type Permission, type UserRole } from "@govexa/shared";
import { env } from "../config";
import { Errors } from "../utils/errors";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: UserRole; email: string };
    user: { sub: string; role: UserRole; email: string };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requirePermission: (
      permissions: Permission[],
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authHookPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_ACCESS_EXPIRY },
  });

  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, _reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch {
        throw Errors.unauthorized();
      }
    },
  );

  fastify.decorate(
    "requirePermission",
    (permissions: Permission[]) =>
      async (req: FastifyRequest, _reply: FastifyReply) => {
        try {
          await req.jwtVerify();
        } catch {
          throw Errors.unauthorized();
        }
        const role = req.user.role;
        const granted = RolePermissions[role] ?? [];
        const allowed = permissions.every((p) => granted.includes(p));
        if (!allowed) throw Errors.forbidden();
      },
  );
};

export default fp(authHookPlugin, { name: "auth-hook" });

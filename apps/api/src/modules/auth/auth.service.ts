import argon2 from "argon2";
import crypto from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { UserStatus, type UserRole } from "@govexa/shared";
import { Errors } from "../../utils/errors";
import { notify } from "../../utils/notifications";
import { env } from "../../config";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const INVITATION_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly signJwt: (payload: {
      sub: string;
      role: UserRole;
      email: string;
    }) => string,
  ) {}

  async inviteUser(email: string, role: UserRole) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw Errors.conflict("A user with this email already exists");

    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);

    const user = await this.prisma.user.create({
      data: {
        email,
        role,
        status: UserStatus.PENDING,
        invitationToken: hashToken(rawToken),
        invitationExpiresAt: expiresAt,
      },
    });

    const inviteUrl = `${env.APP_URL}/auth/accept?token=${rawToken}`;

    // Detached from request path — SMTP failure must not fail a committed invite
    notify.userInvited({ toEmail: email, role, inviteUrl, accessCode: rawToken }).catch(() => undefined);

    return { userId: user.id, email: user.email, role: user.role, expiresAt };
  }

  async acceptInvitation(rawToken: string, password: string) {
    const hashed = hashToken(rawToken);
    const user = await this.prisma.user.findUnique({
      where: { invitationToken: hashed },
    });

    if (
      !user ||
      user.invitationAcceptedAt !== null ||
      !user.invitationExpiresAt ||
      user.invitationExpiresAt < new Date()
    ) {
      throw Errors.badRequest("Invalid or expired invitation token");
    }

    const passwordHash = await argon2.hash(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        status: UserStatus.ACTIVE,
        invitationToken: null,
        invitationExpiresAt: null,
        invitationAcceptedAt: new Date(),
      },
    });

    return this.issueTokens(user.id, user.role, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Run verify even when user not found to prevent timing-based user enumeration
    const hash = user?.passwordHash ?? "$argon2id$v=19$m=65536,t=3,p=4$notarealuserhash$notarealuserhash";
    const valid = await argon2.verify(hash, password);

    if (!user || !valid || !user.passwordHash) throw Errors.unauthorized();
    if (user.status === UserStatus.PENDING) {
      throw Errors.badRequest("Invitation not yet accepted — check your email for the invitation link");
    }
    if (user.status !== UserStatus.ACTIVE) throw Errors.forbidden();

    return this.issueTokens(user.id, user.role, user.email);
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!stored || stored.revokedAt !== null || stored.expiresAt < new Date()) {
      throw Errors.unauthorized();
    }

    const newToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
      this.prisma.refreshToken.create({ data: { token: newToken, userId: stored.userId, expiresAt } }),
    ]);

    const accessToken = this.signJwt({
      sub: stored.user.id,
      role: stored.user.role,
      email: stored.user.email,
    });
    return {
      accessToken,
      refreshToken: newToken,
      user: { id: stored.user.id, email: stored.user.email, role: stored.user.role },
    };
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokens(userId: string, role: UserRole, email: string) {
    const accessToken = this.signJwt({ sub: userId, role, email });
    const refreshToken = crypto.randomBytes(40).toString("hex");

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return { accessToken, refreshToken, user: { id: userId, email, role } };
  }
}

import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "./auth.service";
import { UserStatus, UserRole } from "@govexa/shared";

vi.mock("argon2", () => ({
  default: {
    verify: vi.fn(),
    hash: vi.fn().mockResolvedValue("$argon2id$v=19$m=65536,t=3,p=4$hashed"),
  },
}));

vi.mock("../../utils/notifications", () => ({
  notify: { userInvited: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock("../../config", () => ({
  env: { APP_URL: "http://localhost:3001" },
}));

function buildPrisma() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn(),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  };
}

describe("AuthService", () => {
  let prisma: ReturnType<typeof buildPrisma>;
  let service: AuthService;
  const signJwt = vi.fn().mockReturnValue("test.jwt.token");

  beforeEach(() => {
    vi.clearAllMocks();
    prisma = buildPrisma();
    service = new AuthService(prisma as never, signJwt);
  });

  describe("login", () => {
    it("throws Unauthorized when user is not found", async () => {
      const argon2 = (await import("argon2")).default;
      vi.mocked(argon2.verify).mockResolvedValue(false);
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login("ghost@govexa.in", "pass1234")).rejects.toMatchObject({ statusCode: 401 });
    });

    it("throws Unauthorized when password is wrong", async () => {
      const argon2 = (await import("argon2")).default;
      vi.mocked(argon2.verify).mockResolvedValue(false);
      prisma.user.findUnique.mockResolvedValue({
        id: "u1",
        email: "admin@govexa.in",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$real",
        status: UserStatus.ACTIVE,
        role: UserRole.SUPER_ADMIN,
      });
      await expect(service.login("admin@govexa.in", "wrongpass")).rejects.toMatchObject({ statusCode: 401 });
    });

    it("throws BadRequest for PENDING users", async () => {
      const argon2 = (await import("argon2")).default;
      vi.mocked(argon2.verify).mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue({
        id: "u2",
        email: "pending@govexa.in",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$real",
        status: UserStatus.PENDING,
        role: UserRole.DRIVER,
      });
      await expect(service.login("pending@govexa.in", "pass1234")).rejects.toMatchObject({ statusCode: 400 });
    });

    it("throws Forbidden for SUSPENDED users", async () => {
      const argon2 = (await import("argon2")).default;
      vi.mocked(argon2.verify).mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue({
        id: "u3",
        email: "suspended@govexa.in",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$real",
        status: UserStatus.SUSPENDED,
        role: UserRole.DRIVER,
      });
      await expect(service.login("suspended@govexa.in", "pass1234")).rejects.toMatchObject({ statusCode: 403 });
    });

    it("returns tokens on successful login", async () => {
      const argon2 = (await import("argon2")).default;
      vi.mocked(argon2.verify).mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue({
        id: "u4",
        email: "admin@govexa.in",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$real",
        status: UserStatus.ACTIVE,
        role: UserRole.SUPER_ADMIN,
      });
      const result = await service.login("admin@govexa.in", "pass1234");
      expect(result.accessToken).toBe("test.jwt.token");
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe("admin@govexa.in");
    });
  });

  describe("inviteUser", () => {
    it("throws Conflict when email already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "exists@govexa.in" });
      await expect(service.inviteUser("exists@govexa.in", UserRole.DRIVER)).rejects.toMatchObject({ statusCode: 409 });
    });

    it("creates user and returns invite metadata", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "new-id",
        email: "new@govexa.in",
        role: UserRole.DRIVER,
        invitationExpiresAt: new Date(Date.now() + 48 * 3600 * 1000),
      });
      const result = await service.inviteUser("new@govexa.in", UserRole.DRIVER);
      expect(result.email).toBe("new@govexa.in");
      expect(result.role).toBe(UserRole.DRIVER);
      expect(prisma.user.create).toHaveBeenCalledOnce();
    });

    it("fires notification without blocking the response", async () => {
      const { notify } = await import("../../utils/notifications");
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "new-id",
        email: "new@govexa.in",
        role: UserRole.DRIVER,
        invitationExpiresAt: new Date(Date.now() + 48 * 3600 * 1000),
      });
      await service.inviteUser("new@govexa.in", UserRole.DRIVER);
      await vi.waitFor(() => expect(notify.userInvited).toHaveBeenCalledOnce());
    });
  });

  describe("acceptInvitation", () => {
    it("throws BadRequest for unknown token", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.acceptInvitation("badtoken", "pass1234")).rejects.toMatchObject({ statusCode: 400 });
    });

    it("throws BadRequest for already accepted invitation", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "u1",
        invitationAcceptedAt: new Date(),
        invitationExpiresAt: new Date(Date.now() + 1000),
        status: UserStatus.PENDING,
        role: UserRole.DRIVER,
        email: "test@govexa.in",
      });
      await expect(service.acceptInvitation("tok", "pass1234")).rejects.toMatchObject({ statusCode: 400 });
    });

    it("throws BadRequest for expired invitation", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "u1",
        invitationAcceptedAt: null,
        invitationExpiresAt: new Date(Date.now() - 1000),
        status: UserStatus.PENDING,
        role: UserRole.DRIVER,
        email: "test@govexa.in",
      });
      await expect(service.acceptInvitation("tok", "pass1234")).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe("logout", () => {
    it("revokes the refresh token by token value", async () => {
      await service.logout("refresh-token-abc");
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { token: "refresh-token-abc", revokedAt: null } }),
      );
    });
  });
});

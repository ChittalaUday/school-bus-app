import path from "node:path";
import process from "node:process";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch {
  // env vars may already be injected directly
}

const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) {
  process.stderr.write("DATABASE_URL is required\n");
  process.exit(1);
}

async function main() {
  const adapter = new PrismaPg({ connectionString: DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const passwordHash = await argon2.hash("changeme123");

  const user = await prisma.user.upsert({
    where: { email: "govexa@gmail.com" },
    update: {},
    create: {
      email: "govexa@gmail.com",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      phone: "+919963362027",
      phoneVerified: true,
      invitationAcceptedAt: new Date(),
    },
  });

  process.stdout.write(`Seeded superadmin: ${user.email} (id: ${user.id})\n`);
  await prisma.$disconnect();
}

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});

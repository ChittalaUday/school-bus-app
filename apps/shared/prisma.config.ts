import path from "node:path";
import process from "node:process";
import { defineConfig } from "prisma/config";

// When Prisma CLI runs from apps/shared/, load DATABASE_URL from apps/api/.env
try {
  process.loadEnvFile(path.join(__dirname, "..", "api", ".env"));
} catch {
  // env var may already be injected (CI, Docker, etc.)
}

const databaseUrl = process.env["DATABASE_URL"];

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  ...(databaseUrl != null && {
    datasource: { url: databaseUrl },
  }),
});

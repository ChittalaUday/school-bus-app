import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7: connection URL moves here, out of schema.prisma.
// This file is consumed by the Prisma CLI only (migrate, generate, studio).
// Runtime connection pooling (max:10 per CONSTRAINTS.md) lives in src/plugins/prisma.ts.

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");

      const connectionString = process.env["DATABASE_URL"];
      if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is required");
      }

      return new PrismaPg({ connectionString });
    },
  },
});

import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7: connection URL moves here (datasource.url), out of schema.prisma.
// This file is consumed by the Prisma CLI only (migrate, generate, studio).
// Runtime client uses the @prisma/adapter-pg driver adapter — see src/plugins/prisma.ts.
//
// datasource is omitted when DATABASE_URL is not set so that `prisma generate`
// (which does not connect to the DB) works without a .env file present.
// `prisma migrate dev` will fail at connection time if DATABASE_URL is absent.

const databaseUrl = process.env["DATABASE_URL"];

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  ...(databaseUrl != null && {
    datasource: { url: databaseUrl },
  }),
});

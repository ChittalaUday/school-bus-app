import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  GRAPHHOPPER_URL: z.string().url().default("http://localhost:8989"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3001"),
  APP_URL: z.string().url().default("http://localhost:3001"),

  // Email — Mailhog (port 1025) for dev; set real SMTP credentials in prod
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@govexa.in"),

  // Telegram Bot — optional; OTP and alerts skip silently when not set
  TELEGRAM_BOT_TOKEN: z.string().default(""),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // process.stderr before Fastify logger exists — console is unavailable here
  process.stderr.write("Invalid environment variables:\n");
  process.stderr.write(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2) + "\n");
  process.exit(1);
}

export const env = parsed.data;

export const mailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  from: env.SMTP_FROM,
};

export const telegramConfig = {
  token: env.TELEGRAM_BOT_TOKEN,
};


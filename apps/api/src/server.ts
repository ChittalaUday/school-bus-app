import { buildApp } from "./app";
import { env } from "./config";

async function main() {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "Received shutdown signal, closing server…");
    try {
      await app.close();
      app.log.info("Server closed gracefully");
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, "Error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => { void shutdown("SIGTERM"); });
  process.on("SIGINT", () => { void shutdown("SIGINT"); });

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();


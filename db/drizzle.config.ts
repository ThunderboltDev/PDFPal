import { config } from "dotenv";

const env = (process.env.NODE_ENV ?? "development").trim();

config({
  path: env === "development" ? ".env.local" : ".env",
  quiet: true,
  override: true,
});

import { defineConfig } from "drizzle-kit";

const directUrl = process.env.DATABASE_DIRECT_URL;

if (!directUrl) {
  throw new Error("env variable DATABASE_DIRECT_URL is not defined");
}

export default defineConfig({
  out: "./db/drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: directUrl,
  },
});

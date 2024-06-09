import "dotenv/config";
import { z } from "zod";

console.log("🔐 Loading environment variables...");

const serverSchema = z.object({
  // Node
  NODE_ENV: z.string(),
  // Database
  DATABASE_URL: z.string().min(1),
  // Yelp
  YELP_TOKEN: z.string().min(1),
});

const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error("❌ Invalid environment variables:\n");
  _serverEnv.error.issues.forEach((issue) => {
    console.error(issue);
  });
  throw new Error("Invalid environment variables");
}

const { NODE_ENV, DATABASE_URL, YELP_TOKEN } = _serverEnv.data;

export const env = {
  NODE_ENV,
  DATABASE_URL,
  YELP_TOKEN,
};
console.log("✅ Environment variables loaded");

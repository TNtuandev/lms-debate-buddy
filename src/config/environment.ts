import * as process from "node:process";
import { z } from "zod";

export type Environment = NodeJS.ProcessEnv & {
  NODE_ENV?: string;
  NEST_API_BASE_URL: string;
  NEXT_PUBLIC_API_URL: string;
};

export enum EnvironmentType {
  production = "production",
  development = "development",
  testing = "testing",
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "testing"])
    .default(EnvironmentType.development),
  NEST_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

// ✅ Parse & validate environment variables
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Missing or invalid environment variables.");
}

export const Env = parsed.data;

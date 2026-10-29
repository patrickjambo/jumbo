import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().default(3001),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  // LiveKit — required in production, defaults for local dev
  LIVEKIT_URL: z.string().default('wss://placeholder.livekit.cloud'),
  LIVEKIT_API_KEY: z.string().default('devkey'),
  LIVEKIT_API_SECRET: z.string().default('devsecret_at_least_32_chars_long_pad'),

  // Supabase (optional for Phase 0)
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),

  // Optional AI generation
  GEMINI_API_KEY: z.string().optional(),

  // Optional recording storage
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),
});

function validateEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:\n', result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = validateEnv();
export type Env = typeof env;

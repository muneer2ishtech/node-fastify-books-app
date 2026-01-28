import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Determine environment
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

// Load environment file
const envPath = path.resolve(process.cwd(), envFile);
dotenv.config({ path: envPath });

// Fallback to .env if specific env file not found
if (process.env.NODE_ENV === undefined) {
  dotenv.config();
}

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_SSL: z.coerce.boolean().default(false),
  DB_IDLE_TIMEOUT_MS: z.coerce.number().default(30000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().optional(),
  CORS_CREDENTIALS: z.coerce.boolean().optional().default(true),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse(process.env);

// Log configuration (sensitive data masked)
console.log(`Environment: ${config.NODE_ENV}`);
console.log(`Server: ${config.HOST}:${config.PORT}`);
console.log(`Database: ${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);

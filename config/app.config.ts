import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';

/**
 * Single source of truth for environment configuration.
 *
 * Resolution order (highest wins):
 *   1. Real process environment (what CI injects)
 *   2. config/env/.env.<TEST_ENV>
 *   3. The defaults declared below
 *
 * Usage: `import { appConfig } from '@config/app.config';`
 */

export type TestEnvironment = 'qa' | 'prod';

const SUPPORTED_ENVS: TestEnvironment[] = ['qa', 'prod'];

function resolveEnvironment(): TestEnvironment {
  const requested = (process.env.TEST_ENV ?? 'qa').toLowerCase();
  if (!SUPPORTED_ENVS.includes(requested as TestEnvironment)) {
    throw new Error(
      `Unsupported TEST_ENV "${requested}". Supported values: ${SUPPORTED_ENVS.join(', ')}`,
    );
  }
  return requested as TestEnvironment;
}

const environment = resolveEnvironment();
const envFile = path.resolve(__dirname, 'env', `.env.${environment}`);

if (fs.existsSync(envFile)) {
  // `override: false` keeps CI-injected variables authoritative.
  dotenv.config({ path: envFile, override: false });
}

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required configuration "${key}" for environment "${environment}".`);
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function toNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Configuration "${key}" must be numeric, received "${raw}".`);
  }
  return parsed;
}

function toBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  return raw.toLowerCase() === 'true';
}

export interface AppConfig {
  environment: TestEnvironment;
  baseUrl: string;
  apiBaseUrl: string;
  defaultCity: string;
  headless: boolean;
  slowMo: number;
  defaultTimeout: number;
  isCI: boolean;
  credentials: {
    username: string;
    password: string;
  };
}

export const appConfig: AppConfig = {
  environment,
  baseUrl: required('BASE_URL', 'https://www.zigwheels.com'),
  apiBaseUrl: required('API_BASE_URL', 'https://www.zigwheels.com'),
  defaultCity: optional('DEFAULT_CITY', 'Delhi'),
  headless: toBoolean('HEADLESS', true),
  slowMo: toNumber('SLOW_MO', 0),
  defaultTimeout: toNumber('DEFAULT_TIMEOUT', 45_000),
  isCI: !!process.env.CI,
  credentials: {
    username: optional('APP_USERNAME'),
    password: optional('APP_PASSWORD'),
  },
};

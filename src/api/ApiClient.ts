import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '@utils/logger';

/**
 * Thin wrapper over Playwright's request context so API specs get logging and
 * a consistent shape instead of calling `request.get` directly.
 */
export class ApiClient {
  private readonly log = Logger.for('ApiClient');

  constructor(private readonly request: APIRequestContext) {}

  async get(endpoint: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    this.log.info(`GET ${endpoint}`);
    return this.request.get(endpoint, { headers });
  }

  async post(
    endpoint: string,
    body: unknown,
    headers: Record<string, string> = {},
  ): Promise<APIResponse> {
    this.log.info(`POST ${endpoint}`);
    return this.request.post(endpoint, { data: body, headers });
  }

  async head(endpoint: string): Promise<APIResponse> {
    this.log.info(`HEAD ${endpoint}`);
    return this.request.head(endpoint);
  }

  /** Fetches and parses JSON, failing loudly on a non-2xx. */
  async getJson<T>(endpoint: string): Promise<T> {
    const response = await this.get(endpoint);
    if (!response.ok()) {
      throw new Error(`GET ${endpoint} returned ${response.status()} ${response.statusText()}`);
    }
    return (await response.json()) as T;
  }
}

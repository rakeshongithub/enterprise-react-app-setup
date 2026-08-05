import HttpClient from "./HttpClient";
import AuthService from "../auth/core/AuthService";
import { type ApiRequestOptions } from "./types";
import { UnauthorizedError } from "./errors";

export default class ApiClient {
  private readonly http = new HttpClient();

  async request<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const manager = AuthService.getManager();

    const state = manager.getState();

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (!options.skipAuth && state.session?.accessToken) {
      headers.set("Authorization", `Bearer ${state.session.accessToken}`);
    }

    try {
      return await this.http.request<T>(this.buildUrl(url, options.params), {
        ...options,

        headers,

        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        const refreshed = await manager.refreshToken();

        if (refreshed) {
          return this.request<T>(url, options);
        }
      }

      throw error;
    }
  }

  private buildUrl(url: string, params?: Record<string, unknown>) {
    const requestUrl = new URL(`${import.meta.env.VITE_API_BASE_URL}${url}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          requestUrl.searchParams.append(key, String(value));
        }
      });
    }

    return requestUrl.toString();
  }
}

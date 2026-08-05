import { api } from "./index";
import { type ApiRequestOptions } from "./types";

export default abstract class BaseApiService {
  protected get<T>(url: string, options?: ApiRequestOptions) {
    return api.request<T>(url, {
      ...options,

      method: "GET",
    });
  }

  protected post<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
    return api.request<T>(url, {
      ...options,

      method: "POST",

      body,
    });
  }

  protected put<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
    return api.request<T>(url, {
      ...options,

      method: "PUT",

      body,
    });
  }

  protected patch<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
    return api.request<T>(url, {
      ...options,

      method: "PATCH",

      body,
    });
  }

  protected delete<T>(url: string, options?: ApiRequestOptions) {
    return api.request<T>(url, {
      ...options,

      method: "DELETE",
    });
  }
}

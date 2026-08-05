import {
  ApiError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from './errors';

export default class HttpClient {
  async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      let data: unknown;
      let message = response.statusText;

      try {
        data = await response.json();

        if (data && typeof data === 'object' && 'message' in data) {
          message = String((data as { message: unknown }).message);
        }
      } catch {
        // Ignore JSON parsing errors
      }

      switch (response.status) {
        case 401:
          throw new UnauthorizedError(data);

        case 403:
          throw new ForbiddenError(data);

        case 404:
          throw new NotFoundError(data);

        case 422:
          throw new ValidationError(message, data);

        default:
          if (response.status >= 500) {
            throw new ServerError(response.status, data);
          }

          throw new ApiError(response.status, message, data);
      }
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }
}

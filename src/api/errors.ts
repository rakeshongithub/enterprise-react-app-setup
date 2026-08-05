export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(data?: unknown) {
    super(401, "Unauthorized", data);

    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(data?: unknown) {
    super(403, "Forbidden", data);

    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(data?: unknown) {
    super(404, "Resource not found", data);

    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(422, message, data);

    this.name = "ValidationError";
  }
}

export class ServerError extends ApiError {
  constructor(status: number, data?: unknown) {
    super(status, "Internal server error", data);

    this.name = "ServerError";
  }
}

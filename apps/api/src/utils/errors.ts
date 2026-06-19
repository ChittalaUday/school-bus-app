import { ErrorCode } from "@govexa/shared";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const Errors = {
  notFound: (resource: string) =>
    new AppError(404, ErrorCode.NOT_FOUND, `${resource} not found`),
  unauthorized: () =>
    new AppError(401, ErrorCode.UNAUTHORIZED, "Authentication required"),
  forbidden: () =>
    new AppError(403, ErrorCode.FORBIDDEN, "Insufficient permissions"),
  badRequest: (message: string) =>
    new AppError(400, ErrorCode.BAD_REQUEST, message),
  conflict: (message: string) =>
    new AppError(409, ErrorCode.CONFLICT, message),
  internal: () =>
    new AppError(500, ErrorCode.INTERNAL_ERROR, "An unexpected error occurred"),
} as const;

export const ErrorCode = {
  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  // Input
  VALIDATION_ERROR: "VALIDATION_ERROR",
  BAD_REQUEST: "BAD_REQUEST",

  // Resources
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

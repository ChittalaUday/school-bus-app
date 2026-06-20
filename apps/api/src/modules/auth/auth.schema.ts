import { UserRole } from "@govexa/shared";

const userRoleEnum = Object.values(UserRole);

export const inviteUserBodySchema = {
  type: "object",
  required: ["email", "role"],
  properties: {
    email: { type: "string", format: "email" },
    role: { type: "string", enum: userRoleEnum },
  },
  additionalProperties: false,
} as const;

export const acceptInvitationBodySchema = {
  type: "object",
  required: ["token", "password"],
  properties: {
    token: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8 },
  },
  additionalProperties: false,
} as const;

export const loginBodySchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
  additionalProperties: false,
} as const;

export const refreshBodySchema = {
  type: "object",
  required: ["refreshToken"],
  properties: {
    refreshToken: { type: "string", minLength: 1 },
  },
  additionalProperties: false,
} as const;


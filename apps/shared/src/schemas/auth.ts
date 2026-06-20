import { z } from "zod";
import { UserRole } from "../constants/roles";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

const userRoleValues = Object.values(UserRole) as [UserRole, ...UserRole[]];

export const inviteUserRequestSchema = z.object({
  email: z.string().email(),
  role: z.enum(userRoleValues),
});
export type InviteUserRequest = z.infer<typeof inviteUserRequestSchema>;

export const acceptInvitationRequestSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type AcceptInvitationRequest = z.infer<typeof acceptInvitationRequestSchema>;

// E.164 format — validated here; Telegram delivers the OTP
export const sendOtpRequestSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, "Phone must be in E.164 format"),
});
export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;

export const verifyOtpRequestSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, "Phone must be in E.164 format"),
  otp: z.string().length(6),
});
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.enum(userRoleValues),
    phone: z.string().nullable().optional(),
    phoneVerified: z.boolean(),
  }),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

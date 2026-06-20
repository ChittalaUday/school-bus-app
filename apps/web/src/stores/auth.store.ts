"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserRole } from "@govexa/shared";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// Refresh token held in module memory only — never written to storage or JS-accessible cookies.
let _refreshToken: string | null = null;

export function getRefreshToken() {
  return _refreshToken;
}

const SESSION_COOKIE = "govexa-session";

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: (user, accessToken, refreshToken) => {
    _refreshToken = refreshToken;
    // Signal cookie for middleware route protection — not used for API auth
    Cookies.set(SESSION_COOKIE, "1", { sameSite: "Lax" });
    set({ user, accessToken, isAuthenticated: true });
  },
  logout: () => {
    _refreshToken = null;
    Cookies.remove(SESSION_COOKIE);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

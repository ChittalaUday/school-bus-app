"use client";

import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
  role: string;
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

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: (user, accessToken, refreshToken) => {
    _refreshToken = refreshToken;
    set({ user, accessToken, isAuthenticated: true });
  },
  logout: () => {
    _refreshToken = null;
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

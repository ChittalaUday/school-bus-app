import axios from "axios";
import { AuthResponse } from "@govexa/shared";
import { useAuthStore, getRefreshToken } from "@/stores/auth.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (!refreshing) {
      refreshing = axios
        .post(`${BASE_URL}/auth/refresh`, { refreshToken: getRefreshToken() })
        .then((res) => {
          const { accessToken, refreshToken, user } = res.data as AuthResponse;
          useAuthStore.getState().login(user, accessToken, refreshToken);
          return accessToken;
        })
        .finally(() => {
          refreshing = null;
        });
    }

    const newToken = await refreshing;
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  },
);

export default api;

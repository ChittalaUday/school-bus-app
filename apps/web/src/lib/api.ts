import axios from "axios";
import Cookies from "js-cookie";
import { AuthResponse } from "@govexa/shared";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
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
        .post(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/auth/refresh`, {
          refreshToken: Cookies.get("refreshToken"),
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data as AuthResponse;
          Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
          Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
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

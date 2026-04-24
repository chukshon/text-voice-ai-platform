import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { TOKEN_KEYS } from "@/types/api/auth";
import { PUBLIC_PATHS, ROUTES } from "@/constants";
import { ApiResponseT } from "@/types/api";
import { ENV_CONFIG } from "@/config/variables";

// Constants for magic numbers
const API_TIMEOUT = 10000; // 10 seconds
const REFRESH_API_TIMEOUT = 10000; // 10 seconds

// Flag to prevent multiple redirects
let isRedirecting = false;
// Promise-based approach to prevent race conditions
let refreshPromise: Promise<boolean> | null = null;

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: ENV_CONFIG.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT,
});

// Create a separate axios instance for refresh token requests (no interceptors)
const refreshApi: AxiosInstance = axios.create({
  baseURL: ENV_CONFIG.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: REFRESH_API_TIMEOUT,
});

// Helper to get access token
const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

// Helper to get refresh token
const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

// Helper to update tokens after refresh
const updateTokens = (accessToken: string, refreshToken: string, expiresIn: number) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
};

// Helper to safely redirect to login
const safeRedirectToLogin = () => {
  if (isRedirecting || typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  const isPublicPath = PUBLIC_PATHS.some((path) => currentPath.startsWith(path));

  if (!isPublicPath) {
    isRedirecting = true;

    // Clear all auth data
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);

    // Use window.location.href for a full page reload to clear any state
    window.location.href = ROUTES.LOGIN;
  }
};

// Helper to attempt token refresh
const attemptTokenRefresh = async (): Promise<boolean> => {
  // Use Promise-based approach to prevent race conditions
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  refreshPromise = (async () => {
    try {
      // Use the separate refreshApi instance to avoid interceptors
      const response = await refreshApi.post("auth/refresh-token", {
        refresh_token: refreshToken,
      });

      // Update tokens
      updateTokens(
        response.data.data?.accessToken,
        response.data.data?.refreshToken,
        response.data.data?.refreshTokenExpiresAt,
      );

      return true;
    } catch (error) {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Let the response interceptor handle refresh attempts first
    // Only add token if it exists and is not empty
    const token = getAccessToken();
    if (token && token.trim() !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponseT<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const refreshSuccess = await attemptTokenRefresh();

      if (refreshSuccess) {
        // Get the new access token
        const newToken = getAccessToken();
        if (newToken) {
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request
          return api(originalRequest);
        }
      }

      // If refresh failed or no new token, redirect to login
      safeRedirectToLogin();
    }

    // Transform error to a consistent format
    const apiError: ApiResponseT<unknown> = {
      success: false,
      message: error.response?.data?.message || "An unexpected error occurred",
      error: {
        message: error.response?.data?.message || "An unexpected error occurred",
        errors: error.response?.data?.error?.errors,
      },
    };

    return Promise.reject(apiError);
  },
);

export default api;

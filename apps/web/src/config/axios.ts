import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ApiErrorResponseT } from "@/types/api";
import { ENV_CONFIG } from "@/config/variables";
import { getAccessToken, safeRedirectToLogin, attemptTokenRefresh } from "@/utils/auth";

const API_TIMEOUT = 10000; // 10 seconds
const REFRESH_API_TIMEOUT = 10000; // 10 seconds

let isRedirecting = false;
let refreshPromise: Promise<boolean> | null = null;

const api: AxiosInstance = axios.create({
  baseURL: ENV_CONFIG.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT,
});

const refreshApi: AxiosInstance = axios.create({
  baseURL: ENV_CONFIG.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: REFRESH_API_TIMEOUT,
});

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
  async (error: AxiosError<ApiErrorResponseT>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const refreshSuccess = await attemptTokenRefresh(refreshPromise, refreshApi);

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
      safeRedirectToLogin(isRedirecting);
    }

    // Transform error to a consistent format
    const apiError: ApiErrorResponseT = {
      success: false,
      message: error.response?.data?.message || "An unexpected error occurred",
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  },
);

export default api;

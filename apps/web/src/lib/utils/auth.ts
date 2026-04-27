import { isPublicPath as isPublicPathUtils } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { TOKEN_KEYS } from "@/services/auth/types";
import { AxiosInstance } from "axios";

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
const safeRedirectToLogin = (isRedirecting: boolean) => {
  if (isRedirecting || typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  const isPublicPath = isPublicPathUtils(currentPath);

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
const attemptTokenRefresh = async (
  refreshPromise: Promise<boolean> | null,
  refreshApi: AxiosInstance,
): Promise<boolean> => {
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

export { getAccessToken, getRefreshToken, updateTokens, safeRedirectToLogin, attemptTokenRefresh };

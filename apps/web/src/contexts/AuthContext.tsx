"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { TOKEN_KEYS, UserT } from "@/services/auth/types";
import { useGetLoggedInUserQuery } from "@/services/auth/queries";
import { refreshTokenRequest } from "@/services/auth/requests";
import { toast } from "react-hot-toast";
import { ROUTES } from "@/constants";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserT | null;
  login: (tokens: { access_token: string; refresh_token: string; expires_in: number }) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  isUserLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserT | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!accessToken;

  const { data: userData, isLoading: isUserLoading } = useGetLoggedInUserQuery(!!accessToken);

  useEffect(() => {
    if (userData && accessToken) {
      setUser(userData?.data ?? null);
    }
  }, [userData, accessToken]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Initialize auth state from localStorage and cookies
    const storedAccessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const storedRefreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);
    setIsInitialized(true);
  }, []);

  const login = (tokens: { access_token: string; refresh_token: string; expires_in: number }) => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Enhanced token validation
    if (!tokens.access_token || tokens.access_token.trim() === "") {
      toast.error("Invalid access token received");
      return;
    }

    // Basic JWT format validation
    if (!tokens.access_token.includes(".") || tokens.access_token.split(".").length !== 3) {
      toast.error("Invalid token format");
      return;
    }

    if (!tokens.refresh_token || tokens.refresh_token.trim() === "") {
      toast.error("Invalid refresh token received");
      return;
    }

    if (!tokens.expires_in || tokens.expires_in <= 0) {
      toast.error("Invalid token expiry");
      return;
    }

    // Store tokens in localStorage
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refresh_token);

    // Calculate and store token expiry
    const expiryTime = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN_EXPIRES_AT, expiryTime.toString());

    // Update state
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
  };

  const logout = () => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Clear tokens from localStorage
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN_EXPIRES_AT);

    // Clear state
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    // Redirect to login
    router.push(ROUTES.LOGIN);
  };

  const refreshAccessToken = async (): Promise<void> => {
    // Only run on client side
    if (typeof window === "undefined") return;

    try {
      const currentRefreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

      if (!currentRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await refreshTokenRequest({
        refreshToken: currentRefreshToken,
      });

      // Update tokens in localStorage
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data?.accessToken ?? "");
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data?.refreshToken ?? "");

      // Calculate and store new token expiry
      const expiryTime = Date.now() + (response.data?.refreshTokenExpiresAt?.getTime() ?? 0) * 1000;
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN_EXPIRES_AT, expiryTime.toString());

      // Update state
      setAccessToken(response.data?.accessToken ?? "");
      setRefreshToken(response.data?.refreshToken ?? "");
    } catch (error) {
      // If refresh fails, logout the user
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        refreshAccessToken,
        isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

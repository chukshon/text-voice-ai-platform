"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { TOKEN_KEYS, UserT } from "@/services/auth/types";
import { useGetLoggedInUserQuery } from "@/services/auth/queries";
import { ROUTES } from "@/constants";

interface AuthContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserT | null;
  login: (tokens: { access_token: string; refresh_token: string; expires_in: string }) => void;
  logout: () => void;
  isUserLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<UserT | null>(null);
  const router = useRouter();

  const isAuthenticated = !!accessToken;

  const { data: userData, isLoading: isUserLoading } = useGetLoggedInUserQuery(!!accessToken);

  useEffect(() => {
    if (userData && accessToken) {
      setUser(userData.data as UserT);
    }
  }, [userData, accessToken]);

  // inside AuthProvider, after useGetLoggedInUserQuery(...)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedAccessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const storedRefreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }

    setIsInitialized(true);
  }, []);

  const login = (tokens: { access_token: string; refresh_token: string; expires_in: string }) => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Store tokens in localStorage
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refresh_token);

    // Calculate and store token expiry
    const expiryTime = tokens.expires_in;
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN_EXPIRES_AT, expiryTime);

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

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        accessToken,
        refreshToken,
        user,
        login,
        logout,
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

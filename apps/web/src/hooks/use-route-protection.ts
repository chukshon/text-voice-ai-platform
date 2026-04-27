import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "nextjs-toploader/app";
import { ROUTES } from "@/constants";

interface useRouteProtectionOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

function useRouteProtection(options: useRouteProtectionOptions = {}) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const { requireAuth = true, redirectTo } = options;

  useEffect(() => {
    // Wait for auth to be initialized before making routing decisions
    if (!isInitialized) return;

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      const targetRoute = redirectTo || ROUTES.LOGIN;
      router.replace(targetRoute);
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but shouldn't be (e.g., on auth pages)
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isInitialized, requireAuth, redirectTo, router]);

  return {
    isInitialized,
    isAuthenticated,
    shouldRender: isInitialized && (requireAuth ? isAuthenticated : !isAuthenticated),
  };
}

export default useRouteProtection;

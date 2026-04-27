"use client";
import useRouteProtection from "@/hooks/use-route-protection";
import GuardLoader from "./guard-loader";

interface NonProtectedRouteProps {
  children: React.ReactNode;
}

export default function NonProtectedRoute({ children }: NonProtectedRouteProps) {
  const { isInitialized, shouldRender } = useRouteProtection({
    requireAuth: false,
  });

  // Wait until auth bootstrap is done
  if (!isInitialized) {
    return <GuardLoader />;
  }

  // If authenticated, don't render auth page (redirect will happen)
  if (!shouldRender) {
    return <GuardLoader />;
  }

  // If unauthenticated, render auth page
  return <>{children}</>;
}

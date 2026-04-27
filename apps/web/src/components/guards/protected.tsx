"use client";
import useRouteProtection from "@/hooks/use-route-protection";
import GuardLoader from "./guard-loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isInitialized, shouldRender } = useRouteProtection({
    requireAuth: true,
  });

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return <GuardLoader />;
  }

  // If not authenticated, don't render children (will redirect)
  if (!shouldRender) {
    return <GuardLoader />;
  }

  // If authenticated, render children
  return <>{children}</>;
}

"use client";
import { Spinner } from "@/components/ui/spinner";
import useRouteProtection from "@/hooks/use-route-protection";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isInitialized, shouldRender } = useRouteProtection({
    requireAuth: true,
  });

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner type="loader" />
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!shouldRender) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner type="loader" />
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}

"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinner";
import useRouteProtection from "@/hooks/use-route-protection";

interface NonProtectedRouteProps {
  children: React.ReactNode;
}

export default function NonProtectedRoute({ children }: NonProtectedRouteProps) {
  const { isInitialized, shouldRender } = useRouteProtection({
    requireAuth: false,
  });

  // Wait until auth bootstrap is done
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // If authenticated, don't render auth page (redirect will happen)
  if (!shouldRender) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // If unauthenticated, render auth page
  return <>{children}</>;
}

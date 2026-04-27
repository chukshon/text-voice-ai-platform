"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinner";
import useRouteProtection from "@/hooks/use-route-protection";
import { AudioWaveform } from "lucide-react";

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
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground">
            <AudioWaveform className="size-3.5 text-background" />
          </div>
          <span className="text-sm font-bold tracking-tight">Text to Voice AI</span>
        </div>
        <Spinner />
      </div>
    );
  }

  // If authenticated, don't render auth page (redirect will happen)
  if (!shouldRender) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground">
            <AudioWaveform className="size-3.5 text-background" />
          </div>
          <span className="text-sm font-bold tracking-tight">Text to Voice AI</span>
        </div>
        <Spinner />
      </div>
    );
  }

  // If unauthenticated, render auth page
  return <>{children}</>;
}

"use client";
import { Spinner } from "@/components/ui/spinner";
import useRouteProtection from "@/hooks/use-route-protection";
import { AudioWaveform } from "lucide-react";

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

  // If not authenticated, don't render children (will redirect)
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

  // If authenticated, render children
  return <>{children}</>;
}

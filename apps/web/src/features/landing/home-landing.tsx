"use client";

import Link from "next/link";
import { AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NonProtectedRoute from "@/components/guards/non-protected";
import { ROUTES } from "@/constants";

export function HomeLanding() {
  return (
    <NonProtectedRoute>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="absolute right-4 top-4 z-50">
          <ThemeToggle />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, oklch(0.708 0 0 / 0.12), transparent 55%), radial-gradient(circle at 80% 80%, oklch(0.6 0.118 184.704 / 0.08), transparent 45%)",
          }}
        />

        <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-foreground">
              <AudioWaveform className="size-5 text-background" />
            </div>
            <span className="text-lg font-bold tracking-tight">Text to Voice AI</span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Turn text into natural speech
          </h1>
          <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
            Sign in to generate voice from text, manage your voices, and pick up where you left off.
          </p>

          <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-sm sm:flex-row sm:justify-center">
            <Button className="h-11 flex-1 px-6 text-base" asChild>
              <Link href={ROUTES.LOGIN}>Log in</Link>
            </Button>
            <Button variant="outline" className="h-11 flex-1 px-6 text-base" asChild>
              <Link href={ROUTES.REGISTER}>Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    </NonProtectedRoute>
  );
}

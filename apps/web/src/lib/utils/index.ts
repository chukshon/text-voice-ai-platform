import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PUBLIC_PATHS } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to check if a path is public.
 */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path: string) => pathname.startsWith(path));
}

/**
 * Hash a string into a number (simple djb2-like hash).
 * Deterministic — same name always produces the same result.
 */
export function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(h);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PUBLIC_PATHS } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to check if a path is public
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path: string) => pathname.startsWith(path));
}

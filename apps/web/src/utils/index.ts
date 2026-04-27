import { PUBLIC_PATHS } from "@/constants";

// Helper function to check if a path is public
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path: string) => pathname.startsWith(path));
}

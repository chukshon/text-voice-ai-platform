import type { User } from "@repo/db";

export type UserDataT = Omit<User, "passwordHash" | "updatedAt">;

export type AuthResponseT = {
  user: UserDataT;
  accessToken: string;
  refreshToken: string;
};

export type RefreshAuthResponseT = Omit<AuthResponseT, "user">;

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

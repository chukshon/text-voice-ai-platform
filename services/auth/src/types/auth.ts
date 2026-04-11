import type { User } from "@repo/db";

export type UserDataT = Omit<User, "passwordHash" | "updatedAt">;

export type RegisterResponseT = {
  user: UserDataT;
  accessToken: string;
  refreshToken: string;
};

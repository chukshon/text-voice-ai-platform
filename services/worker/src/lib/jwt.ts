import { env } from "@/config/env";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = env.JWT_SECRET;

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};

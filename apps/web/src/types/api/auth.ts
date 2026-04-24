export interface LoginPayloadT {
  email: string;
  password: string;
}

export interface RegisterPayloadT {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenPayloadT {
  refreshToken: string;
}

export const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  REFRESH_TOKEN_EXPIRES_AT: "refresh_token_expires_at",
};

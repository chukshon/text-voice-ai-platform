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

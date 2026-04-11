export type UserDataT = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type RegisterResponseT = {
  user: UserDataT;
  accessToken: string;
  refreshToken: string;
};

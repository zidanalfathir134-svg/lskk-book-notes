export interface IUser {
  id: number;
  username: string;
  name: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

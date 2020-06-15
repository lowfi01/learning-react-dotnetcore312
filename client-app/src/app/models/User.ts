export interface IUser {
  username: string;
  displayName: string;
  token: string;
  image?: string;
  isHost?: boolean;
}

export interface IUserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string; // fixed as this was not storing correct to user object in store
}

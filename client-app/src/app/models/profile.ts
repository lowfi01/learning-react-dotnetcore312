export interface IProfile {
  displayName: string,
  userName: string,
  bio: string,
  image: string,
  photo: IPhoto[],
}

export interface IPhoto {
  id: string,
  url: string,
  isMain: boolean,
}

export interface IEditProfile {
  UserName: string;
  DisplayName: string;
  Bio: string;
}
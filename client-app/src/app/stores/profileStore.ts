import { action, observable, runInAction, computed } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile: boolean = true;
  @observable uploadingPhoto: boolean = false;

  // check if the user viewing profile, matchs the current logged in user.
  @computed get isCurrentUser(){
    if (this.rootStore.userStore.user && this.profile)
    {
      return this.rootStore.userStore.user.username === this.profile.userName;
    } else
    {
      return false;
    }
  }

  @action loadProfile = async (username:string) => {
    this.loadingProfile = true; // loading icon

    try {
      // fetch profile from api
      const profile = await agent.Profiles.get(username);
      runInAction(() => { // required for mobx to action the result to the local variable.
        this.profile = profile;
        this.loadingProfile = false;
      })
    } catch (error) {
      console.log(error);
      toast.error('Problem uploading photo!')
      runInAction(() => {
        this.loadingProfile = false;
      })
    }
  }

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true; //loading icon

    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) { // Add check to prevent typescript from being grumpy at possible null value
          this.profile.photo.push(photo); // Add to existing photo array so we don't need to fetch an updated list from database
        }

        if (this.profile && photo.isMain && this.rootStore.userStore.user) { // Add check to prevent typescript from being grumpy at possible null value
          // Update Users profile image if this is a main photo.
          this.rootStore.userStore.user.image = photo.url;
          this.profile.image = photo.url;
        }
        this.uploadingPhoto = false;
      })

    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.uploadingPhoto = false;
      })
    }
  }

}
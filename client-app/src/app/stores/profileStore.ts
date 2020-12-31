import { action, observable, runInAction, computed } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile: boolean = true;
  @observable uploadingPhoto: boolean = false;
  @observable loading: boolean = false;

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

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.setMainPhoto(photo.id);

      runInAction(() => {
        // Change main photo for the frontend to prevent reloading from database
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photo.find(a => a.isMain)!.isMain = false;
        this.profile!.photo.find(a => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      })

    } catch (err) {
      console.log(err);
      toast.error('Problem setting photo as main');
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile){
          this.profile.photo = this.profile.photo.filter(x => x.id !== photo.id);
          this.loading = false;
        }
      })
    } catch (err) {
      console.log(err);
      toast.error('Problem deleting the photo!');
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  // @action updateProfile = async (displayName: string, userName: string, )
}
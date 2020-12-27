import { action, observable, runInAction, computed } from "mobx";
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
    this.loadingProfile = true;

    try {
      // fetch profile from api
      const profile = await agent.Profiles.get(username);
      runInAction(() => { // required for mobx to action the result to the local variable.
        this.profile = profile;
        this.loadingProfile = false;
      })
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      })
      console.log(error);
    }

  }

}
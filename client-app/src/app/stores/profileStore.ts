import { action, observable, runInAction } from "mobx";
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
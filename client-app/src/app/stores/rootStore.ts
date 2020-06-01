import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import { createContext } from "react";

export class RootStore {
  activityStore: ActivityStore;
  userStore: UserStore;

  constructor() {
    // Passing the rootStore context (this), to the stores, allows us the.
    // - activityStore to access userStore methods.
    // - userStore to access activityStore methods.
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
  }
}


export const RootStoreContext = createContext(new RootStore());
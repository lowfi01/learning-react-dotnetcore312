import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import { createContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";

// Mobx configuration
// - enable strict mode
// - forces all state mutations to be run
//   only when wrapped in an action
configure({
  enforceActions: "always",
});

export class RootStore {
  activityStore: ActivityStore;
  userStore: UserStore;
  commonStore: CommonStore;
  modalStore: ModalStore;

  constructor() {
    // Passing the rootStore context (this) allow easy navigation between stores.
    // - all stores have access to
    //    - userStore methods.
    //    - activityStore methods.
    //    - CommonStore methods.
    //    - ModalStore methods.
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());

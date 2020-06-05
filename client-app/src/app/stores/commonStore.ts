import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    // Automated feature of Mobx
    // - triggers when store is loaded
    // - triggers when observable is changes
    reaction(
      () => this.token, // what are we reacting - trigger
      (token) => {
        // implement logic that happens on change
        if (token) {
          // Token Exists, so lets store it -- only triggers when we have token
          window.localStorage.setItem("jwt", token);
        } else {
          // No Token, lets delete it from localStore.. --  only triggers if no token is null
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  @observable token: string | null = window.localStorage.getItem("jwt"); // we should initilize this with the jwt so then setAppLoaded can check something
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    // reaction will automatically run --- trigger is token
    this.token = token;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}

import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/User";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore; // rootStore will give us access to all other Stores & their observers, methods & actions etc...
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  } // !!this.user, converts the variable into a boolean type.

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      console.log(user);
      runInAction("user has logged in & stored to user observer", () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token); // save token to local browser storage
      history.push("/activities"); // redirect user on success
    } catch (error) {
      console.log("error found", error);
      // we will throw the error & catch this inside out login form
      throw error;
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  // Fetch user..
  // - this will ask for user, our API holds the logic to identify
  //   the user based on the token we pass up. so basically if no token
  //   then we don't have a user currently logged in!!
  //   Note: we store the token on login to localStorage (very naive)
  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction("fetch & storing user", () => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };
}

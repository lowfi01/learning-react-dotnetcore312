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

  @action login = async (loginValues: IUserFormValues) => {
    try {
      const user = await agent.User.login(loginValues);
      console.log(user);
      runInAction("user has logged in & stored to user observer", () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token); // save token to local browser storage
      this.rootStore.modalStore.closeModal();
      history.push("/activities"); // redirect user on success
    } catch (error) {
      console.log("error found", error);
      // we will throw the error & catch this inside out login form
      throw error;
    }
  };

  @action register = async (registerValues: IUserFormValues) => {
    try {
      const user = await agent.User.register(registerValues);
      console.log(user);
      // Note: we capture the token when we register a user,
      //       remember that in our API, we return the user..
      //       Note: an alternative is to note return the user
      //             and to force them to login again.
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal(); // close the modal after they register
      history.push("/activities"); // redirect to activities list as they are technically logged in now
      runInAction("user has been registerd & stored to user observer", () => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
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

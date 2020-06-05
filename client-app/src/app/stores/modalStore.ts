import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  // this will be the state of our modal
  // - open, display trigger
  // - body, content to be shown within modal
  // - .shallow, observables have trouble with object type
  //   values as this is considered a deep & complex value
  //   to prevent errors due to this complexity, we can define
  //   observable as shallow :)
  //   Note: Shallow means only look at one level down
  @observable.shallow modal = {
    open: false,
    body: null,
  };

  // Open modal & add display elements as content to body
  @action openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  // Close modal & clear all deplay elements
  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}

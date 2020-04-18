import { observable } from 'mobx';
import { createContext } from 'react';

class ActivityStore {
  @observable title = 'hello from mobx';
}

// create new instance of AcitivtyStore.
export default createContext(new ActivityStore());
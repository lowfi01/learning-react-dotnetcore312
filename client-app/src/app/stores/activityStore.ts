import { observable, action } from 'mobx';
import { createContext } from 'react';
import IActivity from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable loadingInitial: boolean = false;

  // action - we use to change observables!
  //   - mobx allows us to mutate state directly
  //     - setting loadingInitial to a new value would not be allowed in redux
  @action loadActivities = () => {
    // set loading screen within App.ts to true!
    this.loadingInitial = true;

    // fetch list of activities from activities api using agent
    agent.Activities
      .list()
      .then(res => {
        res.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activities.push(activity);
        })
      })
      // disable loading screen within App.ts when promise resolves
      .finally(() => this.loadingInitial = false);
  }
}

// create new instance of AcitivtyStore.
export default createContext(new ActivityStore());
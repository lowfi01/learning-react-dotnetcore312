import { observable, action, computed } from 'mobx';
import { createContext } from 'react';
import IActivity from '../models/activity';
import agent from '../api/agent';


// State management
class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable loadingInitial: boolean = false;
  @observable selectedActivity: IActivity | undefined; // undefined does not need a value assigned.
  @observable editState: boolean = false;
  @observable submitting: boolean = false; // loading state for our submit buttons

  // Computed property
  // - calculating values based on already existing observable data.
  // - call this computed function anywhere in our app and it will return
  //   a sort list of activities by date
  @computed get activitiesByDate() {
    // Date.parse(conver iso strings to milliseconds)
    return this.activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  // action - we use to change observables!
  //   - mobx allows us to mutate state directly
  //     - setting loadingInitial to a new value would not be allowed in redux
  @action loadActivities = async () => {
    // set loading screen within App.ts to true!
    this.loadingInitial = true;

    // fetch list of activities from activities api using agent

    try {
      const activitivies = await agent.Activities.list();
      activitivies.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        this.activities.push(activity);
      })
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingInitial = false; // disable loading screen!
    }

  }

  // get activity from our activities array using activity id
  @action selectActivity = (id?: string) => {
    this.selectedActivity = this.activities.find(a => a.id === id);
    this.editState = false;
  }

  // creates activity by passing activity form data to our backend
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity); // server only returns {} on success
      this.activities.push(activity);
      this.selectedActivity = activity;
      this.editState = false;
    } catch (error) {
      console.log(error);
    } finally {
      this.submitting = false;
    }
  }

  // handles the logic to view create activity form
  @action openCreateForm = () => {
    this.selectedActivity = undefined;
    this.editState = true;
  }
}

// create new instance of AcitivtyStore.
export default createContext(new ActivityStore());
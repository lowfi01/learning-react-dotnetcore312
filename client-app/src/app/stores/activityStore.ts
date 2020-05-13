import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext } from "react";
import IActivity from "../models/activity";
import agent from "../api/agent";

// Mobx configuration
// - enable strict mode
// - forces all state mutations to be run
//   only when wrapped in an action
configure({
  enforceActions: "always",
});

// State management
class ActivityStore {
  // Observable maps
  // - used for arrays of items,
  // - gives easy key: value pair structures
  // - makes it easy to locate array elements
  // - makes it easy for mobx to decide if it should update observers
  // - we will be replacing this array: @observable activities: IActivity[] = [];
  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable selectedActivity: IActivity | null = null; // undefined does not need a value assigned.
  @observable submitting = false; // loading state for our submit buttons
  @observable targetedButton = ""; // Capture current button for loading icon animation

  // Computed property
  // - calculating values based on already existing observable data.
  // - call this computed function anywhere in our app and it will return
  //   a sort list of activities by date
  @computed get activitiesByDate() {
    // Date.parse(conver iso strings to milliseconds)
    // Array.from() Creates an array from an iterable object.
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
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
      // - add action wrapper so promises still scope to actions
      //   and work with strict mode.
      runInAction("loading activities populating", () => {
        activitivies.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("loading acitivities disable loading", () => {
        // action wrapper for mobx strict
        this.loadingInitial = false; // disable loading screen!
      });
    }
  };

  @action loadActivity = async (id: string) => {
    this.loadingInitial = true;
    // add condition if no selected activity was selected by user.
    if (!this.activityRegistry.has(id)) {
      try {
        const activityInDb: IActivity = await agent.Activities.details(id);
        runInAction(`loading activity of id: ${id}`, () => {
          // action wrapper for mobx strict
          this.selectedActivity = activityInDb;
        });
      } catch (error) {
        console.log("%c⧭", "color: #f2ceb6", error);
      }
    } else {
      runInAction(`set activity of id: ${id}`, () => {
        // action wrapper for mobx strict
        this.selectedActivity = this.activityRegistry.get(id);
      });
    }

    runInAction(`disable loading screen`, () => {
      this.loadingInitial = false;
    });
  };

  // get activity from our activities array using activity id
  @action selectActivity = (id: string) => {
    // action wrapper for mobx strict
    this.selectedActivity = this.activityRegistry.get(id);
  };

  // creates activity by passing activity form data to our backend
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity); // server only returns {} on success
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("creating activity disable submitting", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true; // turn on loading icon
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        // action wrapper for mobx strict
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("editing activity disable submitting", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    e: React.SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.targetedButton = e.currentTarget.name; // target button, so we can isolate loading animation.
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      // .then(x => x);
      runInAction("deleting activity", () => {
        // action wrapper for mobx strict
        this.activityRegistry.delete(id);
        this.selectedActivity = null;
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      runInAction("deleting activity disable submitting, target", () => {
        this.submitting = false;
        this.targetedButton = "";
      });
    }
  };

  @action OpenEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  @action CancelEditForm = () => {
    this.selectedActivity = null;
  };

  // handles the logic to view create activity form
  @action openCreateForm = () => {
    this.selectedActivity = null;
  };

  @action clearActivity = () => {
    this.selectedActivity = null;
  };
}

// create new instance of AcitivtyStore.
export default createContext(new ActivityStore());

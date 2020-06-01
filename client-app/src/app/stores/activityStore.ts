import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext } from "react";
import {IActivity} from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";

// Mobx configuration
// - enable strict mode
// - forces all state mutations to be run
//   only when wrapped in an action
configure({
  enforceActions: "always",
});

// State management
export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore){
    this.rootStore = rootStore // rootStore will give us access to all other Stores & their observers, methods & actions etc...
  }

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
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values()) // Array.from() conversts map to array.
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    // sort activities based on date in milliseconds.
    const sortedActivities = activities.sort(
      (a, b) => a.date!.getTime() - b.date.getTime()
    );

    /*
    // group activities by date
    // - object.entries, will return a new array for each key property. (An array of arrays)
      // reducer logic  does this
          //so callback function would look like
            const groupingCallback = (groupedActivities,activity) => {
              let key:string = activity.date.split('T')[0] //would give us this - "2020-02-04"
              if(!groupedActivities[key]){
                  groupedActivities[key] = activity;
              }
              groupedActivities[key] = [...groupedActivities[key],activity];
              return  groupedActivities ;
            }

          // resulting output will look like this
            "2020-02-04": [
                {
                  "id": "6648f967-c97a-4daf-a35e-8c6e6790e249",
                  "title": "Future Activity 2",
                  "description": "Activity 2 months in future",
                  "category": "music",
                  "date": "2020-02-04T09:36:11",
                  "city": "London",
                  "venue": "O2 Arena"
                },
                {
                  "id": "60fdfb82-c2e1-4cdc-b87c-1bca06eb9ec8",
                  "title": "Future Activity 3",
                  "description": "Activity 3 months in future",
                  "category": "drinks",
                  "date": "2020-02-04T09:36:11",
                  "city": "London",
                  "venue": "Another pub"
                }
              ]
        // object.entries does this
            [
              "2020-02-04",
              [
                {
                  "id": "6648f967-c97a-4daf-a35e-8c6e6790e249",
                  "title": "Future Activity 2",
                  "description": "Activity 2 months in future",
                  "category": "music",
                  "date": "2020-02-04T09:36:11",
                  "city": "London",
                  "venue": "O2 Arena"
                },
                {
                  "id": "60fdfb82-c2e1-4cdc-b87c-1bca06eb9ec8",
                  "title": "Future Activity 3",
                  "description": "Activity 3 months in future",
                  "category": "drinks",
                  "date": "2020-02-04T09:36:11",
                  "city": "London",
                  "venue": "Another pub"
                }
              ]
            ]
      */

    return Object.entries(
      sortedActivities.reduce((activitiesReduce, activity) => {
        // capture only date not time "2020-04-03T23:27:08"
        const key: string = activity.date.toISOString().split("T")[0]; // "2020-04-03"
        activitiesReduce[key] = activitiesReduce[key]
          ? [...activitiesReduce[key], activity]
          : [activity];
        return activitiesReduce;
      }, {} as { [key: string]: IActivity[] })
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
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
      });
      // console.log(this.groupActivitiesByDate(activitivies)); // TESTING this.groupActivitiesByDate();
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
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting activity',() => {
          activity.date = new Date(activity.date);
          this.selectedActivity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        })
        return activity;
      } catch (error) {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        })
        console.log(error);
      }
    }
  }

  // @action loadActivity = async (id: string) => {

  //   this.loadingInitial = true;
  //   // add condition if no selected activity was selected by user.
  //   if (!this.activityRegistry.has(id)) {
  //     try {
  //       const activityInDb: IActivity = await agent.Activities.details(id);
  //       runInAction(`loading activity of id: ${id}`, () => {
  //         // action wrapper for mobx strict
  //         activityInDb.date = new Date(activityInDb.date!);
  //         this.selectedActivity = activityInDb;
  //       });
  //     } catch (error) {
  //       console.log("%c⧭", "color: #f2ceb6", error);
  //     }
  //   } else {
  //     runInAction(`set activity of id: ${id}`, () => {
  //       // action wrapper for mobx strict
  //       this.selectedActivity = this.activityRegistry.get(id);
  //     });
  //   }

  //   runInAction(`disable loading screen`, () => {
  //     this.loadingInitial = false;
  //   });
  // };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  // get activity from our activities array using activity id
  @action selectActivity = (id: string) => {
    // action wrapper for mobx strict
    this.selectedActivity = this.activityRegistry.get(id);
  };

  // creates activity by passing activity form data to our backend
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true; // handles loading icon for buttons
    try {
      await agent.Activities.create(activity); // server only returns {} on success
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("creating activity disable submitting", () => {
        this.submitting = false; // disable loading icon for button
      });
      toast.error("problem submitting data");
      console.log(error.response)
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
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      toast.error("problem submitting data");
      console.log(error.response);
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

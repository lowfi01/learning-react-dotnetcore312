import { observable, action, computed, runInAction } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/util/util";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

// State management
export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore; // rootStore will give us access to all other Stores & their observers, methods & actions etc...
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
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;

  // setup signalR & create a connection
  @action createHubConnection = (activityId: string) => {
    // build config + logging & Connection to chathub
    this.hubConnection = new HubConnectionBuilder()
     .withUrl('http://localhost:5000/chat', {
       // options
       accessTokenFactory: () => this.rootStore.commonStore.token!
     })
     .configureLogging(LogLevel.Information)
     .build();

    // configure how signalR starts
    this.hubConnection.start()
    .then(() => console.log(this.hubConnection!.state))
    .then(() => {
      console.log("Attempting to join group");
      if (this.hubConnection!.state === 'Connected') this.hubConnection!.invoke('AddToGroup', activityId);
    })
    .catch(err => console.log("Error establishing connection to chathub: ", err))

    // recieving comments back from chathub
    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.selectedActivity!.comments.push(comment);
      })
    })

    this.hubConnection.on('Send', message => {
      toast.info(message); // Debugging - this should show when someone joins the group... remove for prod
    })
  }

  // stop connection
  @action stopHubConnection = () => {
    this.hubConnection?.invoke('RemoveFromGroup', this.selectedActivity?.id)
    .then(() => {
      // only on succesfully removed from group do we stop the connection
      this.hubConnection!.stop(); // turns off hubchat connection
    })
    .then(() => {
      console.log("User has been removed from group: ", this.selectedActivity?.id)
    })
    .catch((err) => {
      console.log("something had gone wrong ", err)
    });
  }

  // add comment with the provided values from form.
  @action addComment = async(values: any) => {
    values.activityId = this.selectedActivity!.id;
    try {
      // this will invoke the method from our server (SendComment method... which takes a comment.command object).
      // Note: we do not need to use axios.. we just need to invoke the method :)
      await this.hubConnection!.invoke('SendComment', values);
    } catch (error) {
      console.log(`Error adding comment: ${error}`)
    }
  }


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
          setActivityProps(activity, this.rootStore.userStore.user!); // this will modify the activity variable :D so we won't need to say const newActivity
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
        runInAction("getting activity", () => {
          setActivityProps(activity, this.rootStore.userStore.user!); // this will modify the activity variable :D so we won't need to say const newActivity
          this.selectedActivity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

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
  };

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
      // Note: as we would like to represent this data live, we will just create the shape of the data
      //       saveed to the database & store it into our activityRegistry :D
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      const attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      activity.comments = [];
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
      console.log(error.response);
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

  @action attendActivity = async () => {
    // Note: We can assume user must be logged in to reach the join attendee button :D
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    // make changes to API
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(
        "User has been successfully added to activity as attendee",
        () => {
          // Note: We can assume that the activity is not null.. as they are viewing the activity detail when clicking attendee!
          if (this.selectedActivity != null) {
            // Note: acitivity will have a list of attendees
            this.selectedActivity.attendees.push(attendee);
            this.selectedActivity.isGoing = true;
            // save changes to our activity dictionary (map!)
            this.activityRegistry.set(
              this.selectedActivity.id,
              this.selectedActivity
            );
          }
          this.loading = false;
        }
      );
    } catch (error) {
      runInAction(
        "Problem signing up to activity",
        () => (this.loading = false)
      );
      toast.error("Problem signing up to activity");
      console.log(error);
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.selectedActivity!.id);
      runInAction("Successfully unattended activity", () => {
        if (this.selectedActivity != null) {
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            (attendee) =>
              // false will be removed from array
              attendee.username !== this.rootStore.userStore.user!.username
          );
          this.selectedActivity.isGoing = false;
          // save changes to our activity dictionary (map!)
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction("Problem unattending activity", () => (this.loading = false));
      toast.error("Problem unattending activity");
      console.log(error);
    }
  };
}

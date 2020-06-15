import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/User";

// Combine Date & Time objects to be a single date object
export const combineDateAndTime = (date: Date, time: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // month returns a number begging from 0;
  const day = date.getDate();

  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";
  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + " " + timeString);
};

// Define the Activity properties
// - date to a new Date object as it is in string format
// - isGoing, will check if the attendee array contains the existing user logged in!
//   Note: we are store the current logged in user within mobx UserStore so this is possible
// - isHost, This is defined when activity is initially created and stored to database.
//   Note: don't be confused that we are checking username again it's just to prevent errors :D
// - Some(), allows us to check an array for a condition & return true... good for conditionals such as isGoing & isHost variable.
export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    // some() returns true for any element of the array
    (a) => a.username === user.username // check if the current activity in loop has the logged in user attending!!
  );
  activity.isHost = activity.attendees.some(
    (a) => a.username === user.username && a.isHost // check current user is the host
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
  };
};

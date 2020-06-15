export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  attendees: IAttendee[];
}

// interface for option values
// - we use Partial, to set all values of IActivity as optional
// - note: we are just copying the values over
export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date;
}

// create class to initilize form values
// - provides new instance of this class to populate useState within ActivityForm
// - Note: implements, the new class can be treated as the same "shape"
//   - here we want want to implement the interface!
//   - note: c# has a cool auto implementation, while typescript does not.
export class ActivityFormValues implements IActivityFormValues {
  // initialize class values
  id?: string = undefined;
  title = "";
  category = "";
  description = "";
  date?: Date = undefined;
  time?: Date = undefined;
  city = "";
  venue = "";

  // constructor
  constructor(init?: IActivityFormValues) {
    // Date & Time objects should be the same
    // - As we have two different fields that define them seperately
    if (init && init.date) {
      init.time = init.date;
    }

    // Auto map data (populate init values to class values)
    // - typescript 2.1 has auto mapping, similar to model binding
    // - Object.assign(target, source) will do this for us
    //    - We can define the target class (initialized values) with this
    //    - we can define the source (who provides the data) with the argument passed
    Object.assign(this, init);
  }
}

// Model that defines an attendee
export interface IAttendee {
  username: string;
  displayName: string;
  image: string;
  isHost: boolean;
}

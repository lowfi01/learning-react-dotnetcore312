import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, GridColumn, Grid, FormGroup } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";

// State management tool
import ActivityStore from "../../../app/stores/activityStore";

// Models
import {ActivityFormValues} from "../../../app/models/activity";

// Components
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";

// utils
import { category } from "../../../app/common/options/categoryOptions";
import { combineDateAndTime } from "../../../app/common/util/util";
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';

// validation object
// - will do the validation for our form fields
// - passed to final form
const validate = combineValidators({
  title: isRequired({message: "The event title is required"}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: "Description needs to be at least 5 characters"}),
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})


interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore); // import and use mobx ActivityStore
  const {loadActivity, loadingInitial, createActivity, editActivity } = activityStore;

  // State - Activity {}
  // - 1. the first generation of this was that we would recieve a IActivity object as prop & then populate
  // - 2. the second geneartion of this was that we would use mobx to fetch our data,
  //   - this was done with, useEffect making the request if we found a url variable passed :id
  //   - then our mobx function would fetch & store a selectedActivity object, which we would
  //   - then use to populate our form.
  // - 3. the third generation we upgraded to using react-final-form.
  //   - here we are now populating our state with mobx, useEffect & our activity.ts models classes
  //   - we have a base interface which defines the desired object
  //   - we then have to make allowances for Date & Time objects
  //   - we then created a class ActivityFormValues(),
  //         - holds default values to populate blank form.
  //         - auto populates values with acitivities when we pass an :id
  //           - auto mapping is done using object.assign(target, source);
  const [activity, setActivity] = useState(new ActivityFormValues()); // Create hook with either populated or empty fields
  const [loading, setLoading] = useState(false); // load statement management (funny enough loadingInitial from mobx will work)

  useEffect(() => {
    if (match.params.id) {
        setLoading(true); // loading screen while we fetch activity
        // - loadActivity, will return activity object {}
        //   - which then sets the activity, with the returned object from ActivityFormValues();
        loadActivity(match.params.id)
          .then((activityData) => {
            setActivity(new ActivityFormValues(activityData))
          })
          .finally(() => setLoading(false)); // disable loading once activity has been saved to state
    }
    setLoading(false);
  }, [
    match.params.id,
    loadActivity
  ]);


  const handleFinalFormSubmit = (values: any) => {
    // Combine Date & time objects to a single Date object
    const dateTimeObject = combineDateAndTime(values.date, values.time);

    // Spread operator to create variable that has omitted (removed) fields
    // - ...activity, will have an object that does not contain, date or time properties/fields
    const {date, time, ...activity} = values;
    activity.date = dateTimeObject;  // create new date field & assign it to combined date time object

    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity)
    } else {
      editActivity(activity)
    }
  };


  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing >
          <FinalForm
            validate={validate} // revalidator implementation
            initialValues={activity} // you must pass the inital values for final form to populate fields
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder="title"
                  name="title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  rows={2}
                  placeholder="description"
                  name="description"
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="category"
                  name="category"
                  options={category}
                  value={activity.category}
                  component={SelectInput}
                />
                <FormGroup widths='equal'>
                  <Field
                    component={DateInput}
                    placeholder="date"
                    name="date"
                    date={true}
                    value={activity.date}
                  />
                  <Field
                    component={DateInput}
                    placeholder="time"
                    name="time"
                    time={true}
                    value={activity.time}
                  />
                </FormGroup>
                <Field
                  placeholder="city"
                  name="city"
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  placeholder="venue"
                  name="venue"
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={activityStore.submitting}
                  floated="right"
                  positive
                  type="submit"
                  content="submit"
                  disabled={loading || invalid || pristine}
                />
                <Button
                  onClick={() => {
                    activity.id
                      ? history.push(`/activities/${activity.id}`)
                      : history.push("/activities");
                  }}
                  floated="right"
                  type="button"
                  content="cancel"
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityForm);

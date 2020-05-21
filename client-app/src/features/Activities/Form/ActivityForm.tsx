import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, GridColumn, Grid } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";

// State management tool
import ActivityStore from "../../../app/stores/activityStore";

// Models
import IActivity from "../../../app/models/activity";

// Components
import LoadingComponent from "../../../app/layout/LoadingComponent";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore); // import and use mobx ActivityStore
  const { loadActivity, selectedActivity, clearActivity } = activityStore;
  // const { id } = useParams<DetailParams>(); // useParams hook, allows us to capture /:id variable within url string
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  }); // Create hook with either populated or empty fields

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id)
        // selected activity can be IActivity | Undefined
        // - we can either,
        //    - use selectActivity! // which tells react we are sure it's not undefined
        //    - check using logical and operator if selectActivity exists before using setActivity()
        .then(() => selectedActivity && setActivity(selectedActivity));
    }
    return () => {
      clearActivity();
    };
  }, [
    match.params.id,
    loadActivity,
    selectedActivity,
    clearActivity,
    activity.id.length,
  ]);

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   if (activity.id.length === 0) {
  //     const newActivity = {
  //       ...activity,
  //       id: uuid(),
  //     };
  //     activityStore.createActivity(newActivity).then(() => {
  //       history.push(`/activities/${newActivity.id}`);
  //     });
  //   } else {
  //     activityStore.editActivity(activity).then(() => {
  //       history.push(`/activities/${match.params.id}`);
  //     });
  //   }
  // };

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading Activity" />;

  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
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
                <Field
                  type="datetime-local"
                  placeholder="date"
                  name="date"
                  component={TextInput}
                />
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
                />
                <Button
                  onClick={() => {
                    history.push("/activities");
                  }}
                  floated="right"
                  type="button"
                  content="cancel"
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

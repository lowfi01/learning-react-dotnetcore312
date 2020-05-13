import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import IActivity from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid(),
      };
      activityStore.createActivity(newActivity).then(() => {
        history.push(`/activities/${newActivity.id}`);
      });
    } else {
      activityStore.editActivity(activity).then(() => {
        history.push(`/activities/${match.params.id}`);
      });
    }
  };

  // handle on change for all form inputs
  const handleInputChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value }); // object initialization syntax, [key]: value
  };

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading Activity" />;

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder="title"
          name="title"
          onChange={handleInputChange}
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          placeholder="description"
          name="description"
          onChange={handleInputChange}
          value={activity.description}
        />
        <Form.Input
          placeholder="category"
          name="category"
          onChange={handleInputChange}
          value={activity.category}
        />
        <Form.Input
          type="datetime-local"
          placeholder="date"
          name="date"
          onChange={handleInputChange}
          value={activity.date}
        />
        <Form.Input
          placeholder="city"
          name="city"
          onChange={handleInputChange}
          value={activity.city}
        />
        <Form.Input
          placeholder="venue"
          name="venue"
          onChange={handleInputChange}
          value={activity.venue}
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
    </Segment>
  );
};

export default observer(ActivityForm);

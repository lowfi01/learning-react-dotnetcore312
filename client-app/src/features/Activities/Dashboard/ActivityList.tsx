import React, { useContext } from "react";
import { Item, Segment, Button, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

// state management
import ActivityStore from "../../../app/stores/activityStore";

// models
import IActivity from "../../../app/models/activity";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate,
    deleteActivity,
    submitting,
    targetedButton,
  } = activityStore;
  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map((activity: IActivity) => {
          const {
            id,
            title,
            description,
            date,
            city,
            venue,
            category,
          } = activity;

          return (
            <Item key={id}>
              <Item.Content>
                <Item.Header as="a">{title}</Item.Header>
                <Item.Meta>{date}</Item.Meta>
                <Item.Description>
                  <div>{description}</div>
                  <div>
                    {city}, {venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Button
                    as={Link}
                    to={`/activities/${id}`}
                    floated="right"
                    content="View"
                    color="blue"
                  />
                  <Button
                    name={activity.id}
                    loading={targetedButton === activity.id && submitting}
                    onClick={(e) => {
                      deleteActivity(e, id);
                    }}
                    floated="right"
                    content="Delete"
                    color="red"
                  />
                  <Label basic content={category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);

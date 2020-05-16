import React, { useContext } from "react";
import { Item, Segment, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

// state management
import ActivityStore from "../../../app/stores/activityStore";

// models
import IActivity from "../../../app/models/activity";
import ActivityItem from "./ActivityItem";

const ActivityList: React.FC = () => {
  const { activitiesByDate } = useContext(ActivityStore);
  return (
    <>
      {activitiesByDate.map(([group, activities]) => (
        <React.Fragment key={group}>
          <Label size="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
            {activities.map((activity: IActivity) => {
              return <ActivityItem key={activity.id} activity={activity} />;
            })}
          </Item.Group>
        </React.Fragment>
      ))}
    </>
  );
};

export default observer(ActivityList);

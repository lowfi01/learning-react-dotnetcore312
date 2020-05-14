import React, { useContext } from "react";
import { Item, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

// state management
import ActivityStore from "../../../app/stores/activityStore";

// models
import IActivity from "../../../app/models/activity";
import ActivityItem from "./ActivityItem";

const ActivityList: React.FC = () => {
  const { activitiesByDate } = useContext(ActivityStore);
  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map((activity: IActivity) => {
          return <ActivityItem key={activity.id} activity={activity} />;
        })}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);

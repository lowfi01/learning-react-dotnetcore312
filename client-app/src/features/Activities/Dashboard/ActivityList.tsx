import React, { useContext } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import { format } from "date-fns";

// state management
import { RootStoreContext } from "../../../app/stores/rootStore";

// models
import { IActivity } from "../../../app/models/activity";
import ActivityItem from "./ActivityItem";

const ActivityList: React.FC = () => {
  const {
    activityStore: { activitiesByDate },
  } = useContext(RootStoreContext); // access activity store via root
  return (
    <>
      {activitiesByDate.map(([groupByTime, activities]) => (
        <React.Fragment key={groupByTime}>
          <Label size="large" color="blue">
            {format(groupByTime, "eeee do MMMM")}
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

/* eslint-disable no-mixed-operators */
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

// // Stores
import ActivityStore from "../../../app/stores/activityStore";

// // Models
// import {IActivity} from "../../../app/models/activity";

// Components
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
// import ActivityDetail from "../Details/ActivityDetail";
// import ActivityForm from "../Form/ActivityForm";

interface IProps {
  id: string;
}

const ActivityDashboard: React.FC<IProps> = () => {
  const { loadActivities, loadingInitial } = useContext(ActivityStore); // access activity store (mobx)

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial) {
    return <LoadingComponent content="Loading Activities" />;
  }

  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={4}>
          <h1>Activities Filter</h1>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default observer(ActivityDashboard);

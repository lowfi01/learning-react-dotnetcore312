import React, { useContext, useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailHeader from "./ActivityDetailHeader";
import ActivityDetailInfo from "./ActivityDetailInfo";
import ActivityDetailChat from "./ActivityDetailChat";
import ActiivityDetailSidebar from "./ActiivityDetailSidebar";

interface DetailParams {
  id: string;
}

const ActivityDetail: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const { loadActivity, selectedActivity, loadingInitial } = useContext(
    ActivityStore
  );

  // NOTE - I only added this next line of code for reference.
  // const { id } = useParams<DetailParams>(); // also usable with params

  useEffect(() => {
    // Note - Routing on error will now be handled by agent.ts
    // - reference, commit 1afbe7c274dfed4c01a5e2aac12246471079133d, Add Naive approach throw exception client side
    loadActivity(match.params.id);
  }, [match.params.id, loadActivity, history]);

  if (loadingInitial) return <LoadingComponent content="Loading Activity" />;

  if (!selectedActivity) return <h2>Not found</h2>;

  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityDetailHeader activity={selectedActivity} />
        <ActivityDetailInfo activity={selectedActivity} />
        <ActivityDetailChat />
      </GridColumn>
      <GridColumn width={6}>
        <ActiivityDetailSidebar />
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDetail);

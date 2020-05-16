import React, { useContext, useEffect } from "react";
import { Card, Image, Button, Grid, GridColumn } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { useParams, RouteComponentProps, Link } from "react-router-dom";
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
  const {
    loadActivity,
    selectedActivity,
    CancelEditForm,
    loadingInitial,
  } = useContext(ActivityStore);

  // NOTE - I only added this next line of code for reference.
  const { id } = useParams<DetailParams>(); // also usable with params
  useEffect(() => {
    loadActivity(match.params.id);
  }, [match.params.id, loadActivity]);

  if (loadingInitial || !selectedActivity)
    return <LoadingComponent content="Loading Activity" />;

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

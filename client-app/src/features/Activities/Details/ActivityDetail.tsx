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
    loadActivity(match.params.id).catch((error) => {
      // Note: Catching error chain.
      //  - we are catching error that starts at out agent.ts
      //    - we make a request for an activity detail but activity is not found,
      //    - agent.ts, will recieve response & throw exception
      //    - activityStore.ts, loading activity will catch the error & throw new exception
      //    - ActivityDetail.tsx component, Who initiated the call to the data base for the
      //      activity detail using, userEffect & loadActivity, will handle the exception
      //    - As our objective is to push the user to the errors page, we just push them.
      //    - Note: our router, will push all bad urls to our NotFound component, so we just
      //      push user to a bad url.
      history.push("/notfound");
    });
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

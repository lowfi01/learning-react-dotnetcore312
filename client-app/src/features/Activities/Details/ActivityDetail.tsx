import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { useParams, RouteComponentProps, Link } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";

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
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${selectedActivity?.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{selectedActivity?.title}</Card.Header>
        <Card.Meta>
          <span>{selectedActivity?.date}</span>
        </Card.Meta>
        <Card.Description>{selectedActivity?.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/manage/${id}`}
            basic
            color="blue"
            content="edit"
          />
          <Button
            onClick={() => {
              CancelEditForm();
              history.push("/activities");
            }}
            basic
            color="grey"
            content="cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetail);

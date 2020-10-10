import React, { useContext } from "react";
import { Segment, Image, Item, Header, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const ActivityDetailHeader: React.FC<{ activity: IActivity }> = ({
  activity,
}) => {
  const host = activity.attendees.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const {
    activityStore: { attendActivity, cancelAttendance, loading },
  } = rootStore;
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          style={activityImageStyle}
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date, "eeee do MMM")}</p>
                <p>
                  Hosted by
                  {' '}
                  <Link to={`/profile/${host.displayName}`}>
                    <strong>{host.displayName}</strong>
                  </Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            color="orange"
            floated="right"
          >
            Manage Event
          </Button>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={(x) => cancelAttendance()}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            loading={loading}
            color="teal"
            onClick={(x) => attendActivity()}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailHeader);

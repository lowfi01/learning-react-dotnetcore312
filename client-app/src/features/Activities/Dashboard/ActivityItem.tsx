import React from "react";
import { Item, Button, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
// Models
import { IActivity } from "../../../app/models/activity";
import ActivityItemAttendee from "./ActivityItemAttendee";

interface IProps {
  activity: IActivity;
}

const ActivityItem: React.FC<IProps> = ({ activity }) => {
  const {
    id,
    title,
    description,
    date,
    city,
    venue,
    attendees,
    isHost,
    isGoing
  } = activity;
  // Note: this activity is passed down & will have an attendees array attached
  const host = activity.attendees.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item key={id}>
            <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>{title}</Item.Header>
              <Item.Description>Hosted by {host.displayName}</Item.Description>
              {isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity"
                  />
                </Item.Description>
              )}
              {isGoing && !isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are attending to this activity"
                  />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(date!, "h:mm a")}
        <Icon name="marker" /> {venue}, {city}
      </Segment>
      <Segment secondary>
        <ActivityItemAttendee attendees={attendees} />
      </Segment>
      <Segment clearing>
        <span>{description}</span>
        <Button
          as={Link}
          to={`/activities/${id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityItem);

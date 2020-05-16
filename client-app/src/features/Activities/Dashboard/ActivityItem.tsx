import React from "react";
import { Item, Button, Label, Segment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

// Models
import IActivity from "../../../app/models/activity";

interface IProps {
  activity: IActivity;
}

const ActivityItem: React.FC<IProps> = ({ activity }) => {
  const { id, title, description, date, city, venue, category } = activity;
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item key={id}>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <Item.Content>
              <Item.Header as="a">{title}</Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {date}
        <Icon name="marker" /> {venue}, {city}
      </Segment>
      <Segment secondary>Attendees will go here</Segment>
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

import React from "react";
import { Item, Button, Label } from "semantic-ui-react";
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
    <Item key={id}>
      <Item.Content>
        <Item.Header as="a">{title}</Item.Header>
        <Item.Meta>{date}</Item.Meta>
        <Item.Description>
          <div>{description}</div>
          <div>
            {city}, {venue}
          </div>
        </Item.Description>
        <Item.Extra>
          <Button
            as={Link}
            to={`/activities/${id}`}
            floated="right"
            content="View"
            color="blue"
          />
          <Label basic content={category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default observer(ActivityItem);

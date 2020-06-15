import React, { Fragment } from "react";
import { Segment, List, Item, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IAttendee } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";

interface IProp {
  attendees: IAttendee[];
}

const ActiivityDetailSidebar: React.FC<IProp> = ({ attendees }) => {
  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees.length > 1
          ? `${attendees.length} People Attending`
          : "One Person Attending"}
      </Segment>
      <Segment attached>
        {attendees
          .map((attendee, index) => (
            <List key={index} relaxed divided>
              <Item style={{ position: "relative" }}>
                {attendee.isHost && (
                  <Label
                    style={{ position: "absolute" }}
                    color="orange"
                    ribbon="right"
                  >
                    Host
                  </Label>
                )}
                <Image size="tiny" src={attendee.image || "/assets/user.png"} />
                <Item.Content verticalAlign="middle">
                  <Item.Header as="h3">
                    <Link to={`/profile/${attendee.username}`}>
                      {attendee.displayName}
                    </Link>
                  </Item.Header>
                  {!attendee.isHost && (
                    <Item.Extra style={{ color: "orange" }}>
                      Following
                    </Item.Extra>
                  )}
                </Item.Content>
              </Item>
            </List>
          ))
          .sort()}
      </Segment>
    </Fragment>
  );
};

export default observer(ActiivityDetailSidebar);

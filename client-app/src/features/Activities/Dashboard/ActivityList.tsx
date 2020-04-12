import React from 'react'
import { Item, Segment, Button, Label } from 'semantic-ui-react'
import IActivity from '../../../app/models/activity'


interface IProp {
  activities: IActivity[];
  selectActivity: (id: string) => void; // define the type we are passing
  deleteActivity: (activityId: string) => void;
}

const ActivityList: React.FC<IProp> = ({ activities, selectActivity, deleteActivity }) => {
  return (
    <Segment clear>
      <Item.Group divided>
        {
          activities.map((activity: IActivity) => {
            const { id, title, description, date, city, venue, category } = activity;
            return (
              <Item key={id}>
                <Item.Content>
                  <Item.Header as='a'>{title}</Item.Header>
                  <Item.Meta>{date}</Item.Meta>
                  <Item.Description>
                    <div>{description}</div>
                    <div>{city}, {venue}</div>
                  </Item.Description>
                  <Item.Extra>
                    <Button onClick={() => { selectActivity(id) }} floated='right' content='View' color='blue' />
                    <Button onClick={() => { deleteActivity(id) }} floated='right' content='Delete' color='red' />
                    <Label basic content={category} />
                  </Item.Extra>
                </Item.Content>
              </Item>
            )
          })}

      </Item.Group>
    </Segment>
  )
}

export default ActivityList

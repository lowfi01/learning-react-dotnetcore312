import React from 'react'
import { Item, Segment, Button, Label } from 'semantic-ui-react'
import IActivity from '../../../app/models/activity'
import { observer } from 'mobx-react-lite'


interface IProp {
  activities: IActivity[];
  selectActivity: (id: string) => void; // define the type we are passing
  deleteActivity: (e: React.SyntheticEvent<HTMLButtonElement>, activityId: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityList: React.FC<IProp> = ({ target, submitting, activities, selectActivity, deleteActivity }) => {
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
                    <Button
                      name={activity.id}
                      loading={target === activity.id && submitting}
                      onClick={(e) => { deleteActivity(e, id) }}
                      floated='right' content='Delete' color='red'
                    />
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

export default observer(ActivityList);

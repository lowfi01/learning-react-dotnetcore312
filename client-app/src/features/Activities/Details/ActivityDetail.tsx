import React from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import IActivity from '../../../app/models/activity'

interface IProp {
  selectedActivity: IActivity;
  setEditState: (editState: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityDetail: React.FC<IProp> = ({
  setSelectedActivity,
  setEditState,
  selectedActivity: { title, date, description, category }
}) => {
  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Meta>
          <span>{date}</span>
        </Card.Meta>
        <Card.Description>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button onClick={() => { setEditState(true) }} basic color='blue' content='edit' />
          <Button onClick={() => { setSelectedActivity(null) }} basic color='grey' content='cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default ActivityDetail

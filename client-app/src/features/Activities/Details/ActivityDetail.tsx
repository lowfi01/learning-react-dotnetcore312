import React, { useContext } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import IActivity from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IProp {
  submitting: boolean;
}

const ActivityDetail: React.FC<IProp> = ({
  submitting
}) => {
  const activityStore = useContext(ActivityStore);
  const { selectedActivity } = activityStore;
  const { title, date, description, category } = selectedActivity!;
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
          <Button onClick={() => { activityStore.editState = true }} basic color='blue' content='edit' />
          <Button onClick={() => { activityStore.selectedActivity = undefined }} basic color='grey' content='cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default observer(ActivityDetail);

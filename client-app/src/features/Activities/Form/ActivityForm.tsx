import React, { useState } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import IActivity from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';

interface IProp {
  setEditState: (editState: boolean) => void;
  selectedActivity: IActivity | null;
  createActivity: (activty: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  editState: boolean;
}

const ActivityForm: React.FC<IProp> = ({
  setEditState,
  selectedActivity,
  createActivity,
  editActivity,
  editState
}) => {
  // Populate form with empty values with creating new activity
  const intializeForm = () => {
    if (selectedActivity === null) { // create activity use case
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      }
    }
    return selectedActivity // edit activity use case
  }

  const [activity, setActivity] = useState<IActivity>(intializeForm);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    // if (activity.id.length === 0) {
    //   let newActivity = {
    //     ...activity,
    //     id: uuid()
    //   }
    //   createActivity(newActivity);
    // } else {
    //   editActivity(activity)
    // }

    if (editState) {
      editActivity(activity)
    } else {
      let newActivity = {
        ...activity,
        id: uuid()
      }
      createActivity(newActivity);
    }
  }

  // handle on change for all form inputs
  const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value }); // object initialization syntax, [key]: value
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} >
        <Form.Input placeholder='title' name='title' onChange={handleInputChange} value={activity.title} />
        <Form.TextArea rows={2} placeholder='description' name='description' onChange={handleInputChange} value={activity.description} />
        <Form.Input placeholder='category' name='category' onChange={handleInputChange} value={activity.category} />
        <Form.Input type='datetime-local' placeholder='date' name='date' onChange={handleInputChange} value={activity.date} />
        <Form.Input placeholder='city' name='city' onChange={handleInputChange} value={activity.city} />
        <Form.Input placeholder='venue' name='venue' onChange={handleInputChange} value={activity.venue} />
        <Button floated='right' positive type='submit' content='submit' />
        <Button onClick={() => { setEditState(false) }} floated='right' type='button' content='cancel' />
      </Form>
    </Segment>
  )
}

export default ActivityForm

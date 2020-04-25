import React, { useState, useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';

import IActivity from '../models/activity';
import Navbar from '../../features/Navbar/Navbar';
import ActivityDashboard from '../../features/Activities/Dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore); // access activity store (mobx)
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivtity, setSelectedActivity] = useState<IActivity | null>(null); // defined as union type
  const [editState, setEditState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  const handleSelectActivity = (id: string) => {
    // handle when user selects an activity - using action store.
    activityStore.selectActivity(id);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity)
      .then(() => {
        setActivities([activity, ...activities]);
        setSelectedActivity(activity);
        setEditState(false);
      })
      .then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity)
      .then(() => {
        // Filter and remove only the activity we wish to edit, then add the edited version
        setActivities([activity, ...activities.filter((a) => a.id !== activity.id)]);
        setSelectedActivity(activity);
        setEditState(false);
      })
      .then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (e: React.SyntheticEvent<HTMLButtonElement>, activityId: string) => {
    setSubmitting(true);
    setTarget(e.currentTarget.name);
    agent.Activities.delete(activityId)
      .then(() => {
        setActivities([...activities.filter(a => a.id !== activityId)]);
        setSelectedActivity(null);
      })
      .then(() => setSubmitting(false));
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditState(true);
  }

  if (activityStore.loadingInitial) {
    return (
      <LoadingComponent content="Loading Activities" />
    )
  }

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          setEditState={setEditState}
          setSelectedActivity={setSelectedActivity}
          activities={activityStore.activities}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          target={target}
        />
      </Container>
    </>
  );
}

export default observer(App);



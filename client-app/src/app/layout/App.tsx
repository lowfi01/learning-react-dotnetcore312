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
  // const [activities, setActivities] = useState<IActivity[]>([]);
  // const [selectedActivtity, setSelectedActivity] = useState<IActivity | null>(null); // defined as union type
  // const [submitting, setSubmitting] = useState<boolean>(false);
  // const [target, setTarget] = useState<string>('');

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  if (activityStore.loadingInitial) {
    return (
      <LoadingComponent content="Loading Activities" />
    )
  }

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);



import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';

import IActivity from '../models/activity';
import { Navbar } from '../../features/Navbar/Navbar';
import { ActivityDashboard } from '../../features/Activities/Dashboard/ActivityDashboard';
import agent from '../api/agent';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivtity, setSelectedActivity] = useState<IActivity | null>(null); // defined as union type
  const [editState, setEditState] = useState<boolean>(false);

  useEffect(() => {
    agent.Activities.list()
      .then((res) => {
        let activities: IActivity[] = [];
        res.forEach(a => {
          a.date = a.date.split('.')[0];
          activities.push(a);
        })
        setActivities(activities);
      })
  }, [])

  const handleSelectActivity = (id: string) => {
    // filter returns an array, as we are searching for only one we can assume position [0] is our result.
    const selectedActivityInArray = activities.filter(a => a.id === id)[0];
    setSelectedActivity(selectedActivityInArray);
    setEditState(false);
  }

  const handleCreateActivity = (activity: IActivity) => {
    agent.Activities.create(activity).then(() => {
      setActivities([activity, ...activities]);
      setSelectedActivity(activity);
      setEditState(false);
    })

  }

  const handleEditActivity = (activity: IActivity) => {
    agent.Activities.update(activity).then(() => {
      // Filter and remove only the activity we wish to edit, then add the edited version
      setActivities([activity, ...activities.filter((a) => a.id !== activity.id)]);
      setSelectedActivity(activity);
      setEditState(false);
    })
  }

  const handleDeleteActivity = (activityId: string) => {
    agent.Activities.delete(activityId).then(() => {
      setActivities([...activities.filter(a => a.id !== activityId)]);
      setSelectedActivity(null);
    })
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditState(true);
  }

  return (
    <>
      <Navbar OpenCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          editState={editState}
          setEditState={setEditState}
          activity={selectedActivtity!}
          selectActivity={handleSelectActivity}
          setSelectedActivity={setSelectedActivity}
          activities={activities}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;



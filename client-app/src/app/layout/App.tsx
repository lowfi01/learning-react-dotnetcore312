import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Container } from 'semantic-ui-react';

import IActivity from '../models/activity';
import { Navbar } from '../../features/Navbar/Navbar';


const App: React.FC = () => {
  const [activities, setActivities]: any = useState<IActivity[]>([]);

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((res) => {
        setActivities(res.data);
      })
  }, [])

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        <List>
          {activities.map((activity: IActivity, i: number) => {
            return <List.Item key={activity.id}>{activity.title}</List.Item>
          })}
        </List>
      </Container>
    </>
  );
}

export default App;



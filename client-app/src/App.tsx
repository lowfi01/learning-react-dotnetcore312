import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header, Icon, List } from 'semantic-ui-react';


const App: React.FC = () => {
  const [values, setValues]: any = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/values").then((res) => {
      setValues(res.data);
    })
  }, [])

  return (
    <>
      <Header as='h4' icon>
        <Icon name='users' />
        Account Settings
        <Header.Subheader>
          Demo App
        </Header.Subheader>
      </Header>
      <List>
        {values.map((v: any, i: number) => {
          return <List.Item key={i}>{v.name}</List.Item>
        })}
      </List>
    </>
  );
}

export default App;



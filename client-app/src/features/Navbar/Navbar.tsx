import React, { useContext } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import ActivityStore from '../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IProp {
  //
}

const Navbar: React.FC<IProp> = () => {
  const activityStore = useContext(ActivityStore);
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header>
          <img className="" src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
          Reactivities
        </Menu.Item>
        <Menu.Item
          name='Activities'
        />
        <Menu.Item>
          <Button onClick={() => { activityStore.openCreateForm() }} positive content='Create Activity' />
        </Menu.Item>
      </Container>
    </Menu>
  )
}


export default observer(Navbar);
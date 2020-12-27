import React, { useContext } from 'react'
import { Card, Header, Tab, Image } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';

function ProfilePhotos() {
  const rootStore = useContext(RootStoreContext);
  const { profile } = rootStore.profileStore;
  return (
    <Tab.Pane>
      <Header icon="image" content='Photos' />
      <Card.Group itemsPerRow={5}>
        {profile && profile?.photo.map(p => {
          <Card key={p.id}>
            <Image src={p.url}/>
          </Card>
        })}
      </Card.Group>
    </Tab.Pane>
  )
}

export default ProfilePhotos

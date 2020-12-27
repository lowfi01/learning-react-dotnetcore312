import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Card, Header, Tab, Image, Button, Grid } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';

function ProfilePhotos() {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = rootStore.profileStore;

  // trigger toggle for add photo mode..
  const [addPhotoMode, setAddPhotoMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{paddingBottom: '0'}}>
        <Header floated='left' icon="image" content='Photos' />
          { isCurrentUser &&
            <Button
              floated='right'
              basic
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}/>
          }
        </Grid.Column>
        <Grid.Column width={16}>
          { addPhotoMode ? (
            <p>Photo widget will go here</p>
          ): (
            <Card.Group itemsPerRow={5}>
              {profile && profile?.photo.map(p => (
                  <Card key={p.id}>
                    <Image src={p.url}/>
                    { isCurrentUser &&
                      <Button.Group fluid widths={2}>
                        <Button basic positive content='main'/>
                        <Button basic negative icon='trash'/>
                      </Button.Group>
                    }
                  </Card>
                )
              )}
            </Card.Group>
          )}

        </Grid.Column>
      </Grid>


    </Tab.Pane>
  )
}

export default observer(ProfilePhotos);

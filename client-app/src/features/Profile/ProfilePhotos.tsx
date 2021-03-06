import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Card, Header, Tab, Image, Button, Grid } from 'semantic-ui-react'
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';
import { RootStoreContext } from '../../app/stores/rootStore';

function ProfilePhotos() {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, uploadingPhoto, uploadPhoto, setMainPhoto, loading, deletePhoto } = rootStore.profileStore;

  // trigger toggle for add photo mode..
  const [addPhotoMode, setAddPhotoMode] = useState(false);

  // Local state to differentiate the buttons being clicked
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [delTarget, setDelTarget] = useState<string | undefined>(undefined);

  // create handler to close photo when upload is succesful
  // Note: error handling is done in the store which should show a toast
  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo)
      .then(x => setAddPhotoMode(false));
  }

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
            <PhotoUploadWidget
              loading={uploadingPhoto}
              uploadPhoto={handleUploadImage} />
          ): (
            <Card.Group itemsPerRow={5}>
              {profile && profile.photo.map(p => (
                  <Card key={p.id}>
                    <Image src={p.url}/>
                    { isCurrentUser && (
                        <Button.Group fluid widths={2}>
                          <Button
                            name={p.id}
                            basic
                            positive
                            content='main'
                            onClick={(e) => {
                              setTarget(e.currentTarget.name);
                              setMainPhoto(p)
                            }}
                            loading={loading && target === p.id}
                            disabled={p.isMain}/>
                          <Button
                            name={p.id}
                            basic
                            negative
                            icon='trash'
                            onClick={e => {
                              setDelTarget(e.currentTarget.name);
                              deletePhoto(p);
                            }}
                            loading={loading && delTarget === p.id}
                            disabled={p.isMain}
                            />
                        </Button.Group>
                      )
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

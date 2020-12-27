import React, { Fragment, useState } from 'react';
import { Header, Grid, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoWidgetDropZone from './PhotoWidgetDropZone';

const PhotoUploadWidget = () => {
  // add local state to store preview image
  const [files, setFiles] = useState<any[]>([]);
  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color='teal' sub content='Step 1 - Add Photo' />
          <PhotoWidgetDropZone setFiles={setFiles} files={files}/>
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 2 - Resize image' />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 3 - Preview & Upload' />
          {files.length > 0 && !!files &&
            <Image src={files[0].preview} /> }
        </Grid.Column>
      </Grid>
    </Fragment>
  );
}

export default observer(PhotoUploadWidget);
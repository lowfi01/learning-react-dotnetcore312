import React, { Fragment, useEffect, useState } from 'react';
import { Header, Grid, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoWidgetDropZone from './PhotoWidgetDropZone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

const PhotoUploadWidget = () => {
  // add local state to store preview image
  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview)) // clear the object from files to clear memory.
    }
  })

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
          {files.length > 0 &&
            <PhotoWidgetCropper setImage={setImage} imagePreview={files[0].preview}/>
          }
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 3 - Preview & Upload' />
          {files.length > 0 && !!files &&
            <div className='img-preview' style={{minHeight: '200px', overflow: 'hidden'}}/>
          }
        </Grid.Column>
      </Grid>
    </Fragment>
  );
}

export default observer(PhotoUploadWidget);
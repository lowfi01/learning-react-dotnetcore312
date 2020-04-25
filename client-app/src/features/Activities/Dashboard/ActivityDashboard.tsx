/* eslint-disable no-mixed-operators */
import React, { useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';

// Stores
import ActivityStore from '../../../app/stores/activityStore';


// Models
import IActivity from '../../../app/models/activity';

// Components
import ActivityList from './ActivityList';
import ActivityDetail from '../Details/ActivityDetail';
import ActivityForm from '../Form/ActivityForm';

interface IProps {
  //
}

const ActivityDashboard: React.FC<IProps> = () => {
  const activityStore = useContext(ActivityStore);
  const { editState, selectedActivity } = activityStore;
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && !editState &&
            <ActivityDetail />
          }
          {editState &&
            <ActivityForm
              key={selectedActivity && selectedActivity.id || 0}
            />}
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default observer(ActivityDashboard);

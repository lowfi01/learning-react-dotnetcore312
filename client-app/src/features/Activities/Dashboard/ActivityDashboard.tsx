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
  activities: IActivity[];
  setEditState: (editState: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (e: React.SyntheticEvent<HTMLButtonElement>, acitivityId: string) => void;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  setSelectedActivity,
  activities,
  setEditState,
  editActivity,
  deleteActivity,
  target
}) => {
  const activityStore = useContext(ActivityStore);
  const { editState, selectedActivity, submitting } = activityStore;
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList
            target={target}
            submitting={submitting}
            deleteActivity={deleteActivity}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && !editState &&
            <ActivityDetail
              submitting={submitting}
            />}
          {editState &&
            <ActivityForm
              key={selectedActivity && selectedActivity.id || 0}
              editState={editState}
              editActivity={editActivity}
              selectedActivity={selectedActivity}
              setEditState={setEditState}
              submitting={submitting}
            />}
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default observer(ActivityDashboard);

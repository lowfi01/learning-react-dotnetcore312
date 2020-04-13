import React from 'react'
import { Grid } from 'semantic-ui-react'

// Models
import IActivity from '../../../app/models/activity';

// Components
import ActivityList from './ActivityList';
import ActivityDetail from '../Details/ActivityDetail';
import ActivityForm from '../Form/ActivityForm';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void; // define the type we are passing
  activity: IActivity | null;
  setEditState: (editState: boolean) => void;
  editState: boolean;
  setSelectedActivity: (activity: IActivity | null) => void;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (e: React.SyntheticEvent<HTMLButtonElement>, acitivityId: string) => void;
  submitting: boolean;
  target: string;
}

export const ActivityDashboard: React.FC<IProps> = ({
  setSelectedActivity,
  activities,
  selectActivity,
  activity,
  editState,
  setEditState,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList target={target} submitting={submitting} deleteActivity={deleteActivity} selectActivity={selectActivity} activities={activities} />
        </Grid.Column>
        <Grid.Column width={6}>
          {activity && !editState &&
            <ActivityDetail
              setSelectedActivity={setSelectedActivity}
              selectedActivity={activity}
              setEditState={setEditState}
              submitting={submitting}
            />}
          {editState &&
            <ActivityForm
              // key prop will force component to re-render on change
              // -- use conditional checking to see if activity is null
              // eslint-disable-next-line
              key={activity && activity.id || 0}
              editState={editState}
              editActivity={editActivity}
              createActivity={createActivity}
              selectedActivity={activity}
              setEditState={setEditState}
              submitting={submitting}
            />}
        </Grid.Column>
      </Grid>
    </div>
  )
}

import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'


interface RouteParams {
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({match}) => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, profile, loadingProfile } = rootStore.profileStore;

  // Page first loads, fetch profile & show loading screen to user
  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  if (loadingProfile )return <LoadingComponent content='loading profile details..........' />;

  return (
    <div>
      <Grid>
        <Grid.Column width={16}>
          <ProfileHeader profile={profile!}/>
          <ProfileContent />
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default observer(ProfilePage);

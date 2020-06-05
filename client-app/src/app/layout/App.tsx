import React, { useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "../../features/Navbar/Navbar";
import ActivityDashboard from "../../features/Activities/Dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from "react-router-dom";

// 3rd Part Components
import { ToastContainer } from "react-toastify";

// Components
import HomePage from "../../features/Home/HomePage";
import ActivityForm from "../../features/Activities/Form/ActivityForm";
import ActivityDetail from "../../features/Activities/Details/ActivityDetail";
import NotFound from "./NotFound";
import LoginForm from "../../features/User/LoginForm";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

// us withRouter HOC to give access to all of the react-router-dom proms & location.
// - location will give us access to key.
//   we are able to use the key to force a new instance of component to render.
//   we use this in place of componentDidRecieveProps
//   https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component
const App: React.FC<RouteComponentProps> = ({ location }) => {
  // Initilizing App (sooo that we are able to run our mobx reactions on loading)
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  // useEffect to check to see.
  // - do we have token? - get user from API
  // - do not have token? - set app as loaded only
  useEffect(() => {
    // check to see if token has been stored to windows.localStorage
    if (token) {
      getUser().finally(() => {
        setAppLoaded(); // set loaded to remove loading screen
      });
    } else {
      setAppLoaded(); // set loaded to remove loading screen
    }
  }, [token, getUser, setAppLoaded]);

  // Show loading screen if setAppLoaded has not been lunched
  if (!appLoaded) return <LoadingComponent content={"Loading App"} />;

  return (
    <>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"} // conditionall render the navbar when not viewing the homepage
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetail} />
                <Route
                  key={location.key} // react-router key changes with new route forcing a new instance of the component
                  path={["/createActivity", "/manage/:id"]} // allow for reusable paths for ActivityForm component
                  component={ActivityForm}
                />
                <Route path="/login" component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));

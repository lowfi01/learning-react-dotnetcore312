import React from "react";
import { Container } from "semantic-ui-react";
import Navbar from "../../features/Navbar/Navbar";
import ActivityDashboard from "../../features/Activities/Dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import HomePage from "../../features/Home/HomePage";
import ActivityForm from "../../features/Activities/Form/ActivityForm";
import ActivityDetail from "../../features/Activities/Details/ActivityDetail";

// us withRouter HOC to give access to all of the react-router-dom proms & location.
// - location will give us access to key.
//   we are able to use the key to force a new instance of component to render.
//   we use this in place of componentDidRecieveProps
//   https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component
const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"} // conditionall render the navbar when not viewing the homepage
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetail} />
              <Route
                key={location.key} // react-router key changes with new route forcing a new instance of the component
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));

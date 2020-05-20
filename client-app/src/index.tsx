import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./app/layout/App";
import "./app/layout/styles.css";
import "semantic-ui-css/semantic.min.css";
import * as serviceWorker from "./serviceWorker";
import ScrollToTop from "./app/layout/ScrollToTop";

// export history so as we can import it within our state management tools
export const history = createBrowserHistory();

ReactDOM.render(
  // Replace BrowserRouter with Router.
  // - BrowserRouter is a router that uses the html5 history api, (pushState, history etc..)
  //   - basically it's a high level router that comes with a history api.
  // - Router is a low level component that requires we create our own custom history.
  //   - perdominately it's used with statement tools such as redux & mobx etc...
  //   - note: we can pass this router outside of our components
  <Router history={history}>
    <ScrollToTop />
    <App />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

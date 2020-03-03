import React from "react";
import "@vkontakte/vkui/dist/vkui.css";
import { connect } from "react-redux";

import { HashRouter as Router, Route } from "react-router-dom";
// import {handleLocation, HISTORY_ACTION_PUSH} from "./modules/LocationModule";
// import store from "./store";
// import history from "./routing/history";
import { ConfigProvider } from "@vkontakte/vkui";
import { isDevEnv } from "./tools/helpers";
import MobileContainer from "./containers/MobileContainer/MobileContainer";

const App = () => {
  // history.listen((location, action) => {
  //   store.dispatch(handleLocation(location, action, false));
  // });
  // store.dispatch(handleLocation(history.location, HISTORY_ACTION_PUSH, true));
  return (
    <ConfigProvider
      webviewType="vkapps"
      isWebView={isDevEnv() ? true : undefined}
    >
      <Router history={[]}>
        <Route component={props => <MobileContainer {...props} />} />
      </Router>
    </ConfigProvider>
  );
};

function map(state) {
  return {};
}

export default connect(map, {})(App);

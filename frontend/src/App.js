import React from "react";
import "@vkontakte/vkui/dist/vkui.css";
import { connect } from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import { ConfigProvider } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import MobileContainer from "./containers/MobileContainer/MobileContainer";

const App = ({ colorScheme }) => {
  return (
    <ConfigProvider webviewType="vkapps" isWebView scheme={colorScheme}>
      <Router history={[]}>
        <Route component={props => <MobileContainer {...props} />} />
      </Router>
    </ConfigProvider>
  );
};

const mapStateToProps = state => {
  return {
    colorScheme: state.ui.colorScheme
  };
};

App.propTypes = {
  colorScheme: PropTypes.string.isRequired
};

export default connect(mapStateToProps, {})(App);

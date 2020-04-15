import React from "react";
import "@vkontakte/vkui/dist/vkui.css";
import { connect } from "react-redux";
import { ConfigProvider } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import MobileContainer from "./containers/MobileContainer/MobileContainer";
import { isDevEnv } from "./tools/helpers";

const App = ({ colorScheme }) => {
  return (
    <ConfigProvider
      webviewType="vkapps"
      isWebView={isDevEnv() ? true : undefined}
      scheme={colorScheme}
    >
      <MobileContainer />
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

export default connect(mapStateToProps, null)(App);

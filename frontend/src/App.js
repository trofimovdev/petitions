import React from "react";
import "@vkontakte/vkui/dist/vkui.css";
import { connect } from "react-redux";
import { ConfigProvider } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import MobileContainer from "./containers/MobileContainer/MobileContainer";
import DesktopContainer from "./containers/DesktopContainer/DesktopContainer";
import { isDevEnv } from "./tools/helpers";

const App = ({ colorScheme, launchParameters }) => {
  return (
    <ConfigProvider
      webviewType="vkapps"
      isWebView={isDevEnv() ? true : undefined}
      scheme={colorScheme}
    >
      {launchParameters.vk_platform === "desktop_web" ? (
        <DesktopContainer />
      ) : (
        <MobileContainer />
      )}
    </ConfigProvider>
  );
};

const mapStateToProps = state => {
  return {
    colorScheme: state.ui.colorScheme,
    launchParameters: state.data.launchParameters
  };
};

App.propTypes = {
  colorScheme: PropTypes.string.isRequired,
  launchParameters: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(App);

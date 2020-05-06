import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PageRoot } from "@happysanta/vk-app-ui";
import "@happysanta/vk-app-ui/dist/vkappui.css";
import MainDesktop from "../../components/MainDesktop/MainDesktop";

const DesktopContainer = ({}) => {
  return (
    <PageRoot activePage="main">
      <MainDesktop id="main" />
      <div id="book">book</div>
    </PageRoot>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  };
};

DesktopContainer.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(DesktopContainer);

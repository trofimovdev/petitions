import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {PageRoot, TabItem, PageView} from "@happysanta/vk-app-ui";
import "@happysanta/vk-app-ui/dist/vkappui.css";
import MainDesktop from "../../components/MainDesktop/MainDesktop";
import PetitionDesktop from "../../components/PetitionDesktop/PetitionDesktop";

const DesktopContainer = ({ activeTab, activeView }) => {
  console.log("activeView DesktopContainer", activeView);
  return (
    <PageRoot activePage={activeView}>
      <MainDesktop id="petitions" activeTab={activeTab.feed} />
      <PetitionDesktop id="petition" />
    </PageRoot>
  );
};

const mapStateToProps = state => {
  return {
    activeTab: state.router.activeTab,
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  };
};

DesktopContainer.propTypes = {
  activeTab: PropTypes.object,
  activeView: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DesktopContainer);

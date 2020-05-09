import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PageRoot } from "@happysanta/vk-app-ui";
import "@happysanta/vk-app-ui/dist/vkappui.css";
import MainDesktop from "../../components/MainDesktop/MainDesktop";
import PetitionDesktop from "../../components/PetitionDesktop/PetitionDesktop";
import EditPetitionDesktop from "../../components/EditPetitionDesktop/EditPetitionDesktop";

const DesktopContainer = ({ activeTab, activeView }) => {
  console.log("activeView DesktopContainer", activeView);
  return (
    <PageRoot activePage={activeView}>
      <MainDesktop id="petitions" activeTab={activeTab.feed} />
      <PetitionDesktop id="petition" />
      <EditPetitionDesktop id="edit" />
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

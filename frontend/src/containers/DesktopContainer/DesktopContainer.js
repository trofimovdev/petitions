import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PageRoot } from "@happysanta/vk-app-ui";
import "@happysanta/vk-app-ui/dist/vkappui.css";
import MainDesktop from "../../components/MainDesktop/MainDesktop";
import PetitionDesktop from "../../components/PetitionDesktop/PetitionDesktop";
import EditPetitionDesktop from "../../components/EditPetitionDesktop/EditPetitionDesktop";
import DonePetitionDesktop from "../../components/DonePetitionDesktop/DonePetitionDesktop";
import SplashScreenDesktop from "../../components/SplashScreenDesktop/SplashScreenDesktop";

const DesktopContainer = ({ activeTab, activeView, scrollPosition }) => {
  useEffect(() => {
    const pageScrollPosition = scrollPosition[`petitions_${activeTab.feed}`];
    window.scroll(0, pageScrollPosition);
  }, [activeView, activeTab, scrollPosition]);

  return (
    <PageRoot activePage={activeView}>
      <SplashScreenDesktop id="splashscreen" />
      <MainDesktop id="petitions" activeTab={activeTab.feed} />
      <PetitionDesktop id="petition" />
      <EditPetitionDesktop id="edit" />
      <DonePetitionDesktop id="done" />
    </PageRoot>
  );
};

const mapStateToProps = state => {
  return {
    activeTab: state.router.activeTab,
    activeView: state.router.activeView,
    scrollPosition: state.router.scrollPosition
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
  activeView: PropTypes.string.isRequired,
  scrollPosition: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default connect(mapStateToProps, mapDispatchToProps)(DesktopContainer);

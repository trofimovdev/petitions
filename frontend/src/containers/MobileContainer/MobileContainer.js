import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Epic } from "@vkontakte/vkui";
import {
  setPage,
  goBack,
  setStory,
  setActiveTab,
  closeModal,
  openModal
} from "../../store/router/actions";
import "@vkontakte/vkui/dist/vkui.css";
import Petitions from "../../components/Petitions/Petitions";
import Management from "../../components/Management/Management";

const MobileContainer = props => {
  const {
    activeView,
    activePanel,
    setStory,
    activeStory,
    setActiveTab,
    activeTab,
    scrollPosition,
    setPage,
    activeModals,
    closeModal,
    openModal,
    petitions
  } = props;
  console.log("PETITIONS AAAAAAAAAAAAAAAAA", petitions);
  const activeModal =
    activeModals[activeView] === undefined ? null : activeModals[activeView];

  useEffect(() => {
    const pageScrollPosition = scrollPosition[
      `${activeStory}_${activeView}_${activePanel}_${activeTab[activePanel]}`
    ]
      ? scrollPosition[
          `${activeStory}_${activeView}_${activePanel}_${activeTab[activePanel]}`
        ]
      : scrollPosition[`${activeStory}_${activeView}_${activePanel}`]
      ? scrollPosition[`${activeStory}_${activeView}_${activePanel}`]
      : 0;
    window.scroll(0, pageScrollPosition);
  }, [activeStory, activeView, activePanel, activeTab, scrollPosition, props]);

  return (
    <Epic activeStory={activeStory}>
      <Petitions
        id="petitions"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        activePanel={activePanel}
        setPage={setPage}
        activeStory={activeStory}
        setStory={setStory}
        activeModal={activeModal}
        closeModal={closeModal}
        openModal={openModal}
        petitions={petitions}
      />
      <Management
        id="management"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        activePanel={activePanel}
        activeStory={activeStory}
        setStory={setStory}
        setPage={setPage}
      />
    </Epic>
  );
};

const mapStateToProps = state => {
  return {
    activeView: state.router.activeView,
    activePanel: state.router.activePanel,
    activeStory: state.router.activeStory,
    activeTab: state.router.activeTab,
    scrollPosition: state.router.scrollPosition,
    activeModals: state.router.activeModals,
    petitions: state.petitions
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      { goBack, setPage, setStory, setActiveTab, closeModal, openModal },
      dispatch
    )
  };
}

MobileContainer.propTypes = {
  activeView: PropTypes.string,
  activePanel: PropTypes.string,
  setStory: PropTypes.func,
  activeStory: PropTypes.string,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activeModals: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  scrollPosition: PropTypes.object,
  petitions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileContainer);

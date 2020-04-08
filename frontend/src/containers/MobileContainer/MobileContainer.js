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
  openModal,
  openPopout,
  closePopout
} from "../../store/router/actions";
import { setCurrent, setEdit, setCreate } from "../../store/petitions/actions";
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
    petitions,
    goBack,
    panelsHistory,
    setCurrent,
    openPopout,
    closePopout,
    setEdit,
    setCreate
  } = props;
  const activeModal =
    activeModals[activeView] === undefined ? null : activeModals[activeView];

  const activeViewPanelsHistory = panelsHistory[activeView] || [];

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
    console.log("ACCEDPT SCROLL TO", pageScrollPosition);
    window.scroll(0, pageScrollPosition);
  }, [activeStory, activeView, activePanel, activeTab, scrollPosition]);

  return (
    <Epic activeStory={activeStory}>
      <Petitions
        id="petitions"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        activeView={activeView}
        activePanel={activePanel}
        setPage={setPage}
        activeStory={activeStory}
        setStory={setStory}
        activeModal={activeModal}
        closeModal={closeModal}
        openModal={openModal}
        petitions={petitions}
        goBack={goBack}
        activeViewPanelsHistory={activeViewPanelsHistory}
        setCurrent={setCurrent}
      />
      <Management
        id="management"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        activeView={activeView}
        activePanel={activePanel}
        activeStory={activeStory}
        setStory={setStory}
        setPage={setPage}
        goBack={goBack}
        openPopout={openPopout}
        closePopout={closePopout}
        petitions={petitions}
        setEdit={setEdit}
        setCreate={setCreate}
        activeViewPanelsHistory={activeViewPanelsHistory}
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
    petitions: state.petitions,
    panelsHistory: state.router.panelsHistory
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        goBack,
        setPage,
        setStory,
        setActiveTab,
        closeModal,
        openModal,
        setCurrent,
        openPopout,
        closePopout,
        setEdit,
        setCreate
      },
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
  setPage: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  panelsHistory: PropTypes.object.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileContainer);

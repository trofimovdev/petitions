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
import {
  setCurrent,
  setEdit,
  setCreate,
  setFormType,
  setPopular,
  setLast,
  setSigned,
  setManaged
} from "../../store/petitions/actions";
import "@vkontakte/vkui/dist/vkui.css";
import Petitions from "../../components/Petitions/Petitions";
import Management from "../../components/Management/Management";
import SplashScreen from "../../components/SplashScreen/SplashScreen";

const MobileContainer = ({
  activeView,
  activePanel,
  activeStory,
  activeTab,
  scrollPosition,
  goBack,
  history,
  activeModal
}) => {
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

  // const activeModal =
  //   activeModals[activeView] === undefined ? null : activeModals[activeView];
  return (
    <Epic activeStory={activeStory}>
      <Petitions
        id="petitions"
        activeTab={activeTab}
        goBack={goBack}
        history={history}
      />
      {/* <Management */}
      {/*  id="management" */}
      {/*  setActiveTab={setActiveTab} */}
      {/*  activeTab={activeTab} */}
      {/*  activeView={activeView} */}
      {/*  activePanel={activePanel} */}
      {/*  activeStory={activeStory} */}
      {/*  setStory={setStory} */}
      {/*  setPage={setPage} */}
      {/*  goBack={goBack} */}
      {/*  petitions={petitions} */}
      {/*  setEdit={setEdit} */}
      {/*  setCreate={setCreate} */}
      {/*  activeViewPanelsHistory={activeViewPanelsHistory} */}
      {/*  setFormType={setFormType} */}
      {/*  openModal={openModal} */}
      {/*  closeModal={closeModal} */}
      {/*  activeModal={activeModal} */}
      {/*  setCurrent={setCurrent} */}
      {/* /> */}
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
    history: state.router.panelsHistory[state.router.activeView] || []
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        goBack
      },
      dispatch
    )
  };
};

MobileContainer.propTypes = {
  activeView: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  activeTab: PropTypes.object.isRequired,
  scrollPosition: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileContainer);

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Epic } from "@vkontakte/vkui";
import { goBack } from "../../store/router/actions";
import "@vkontakte/vkui/dist/vkui.css";
import Petitions from "../../components/Petitions/Petitions";
import Management from "../../components/Management/Management";

const MobileContainer = ({
  activeView,
  activePanel,
  activeStory,
  activeTab,
  scrollPosition,
  goBack,
  history
}) => {
  useEffect(() => {
    const pageScrollPosition =
      activeTab &&
      scrollPosition[
        `${activeStory}_${activeView}_${activePanel}_${activeTab[activePanel]}`
      ]
        ? scrollPosition[
            `${activeStory}_${activeView}_${activePanel}_${activeTab[activePanel]}`
          ]
        : scrollPosition[`${activeStory}_${activeView}_${activePanel}`]
        ? scrollPosition[`${activeStory}_${activeView}_${activePanel}`]
        : 0;
    window.scroll(0, pageScrollPosition);

    return () => {};
  }, [activeStory, activeView, activePanel, activeTab, scrollPosition]);

  return (
    <Epic activeStory={activeStory}>
      <Petitions
        id="petitions"
        activeTab={activeTab}
        goBack={goBack}
        history={history}
      />
      <Management id="management" goBack={goBack} history={history} />
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
  activeView: PropTypes.string,
  activePanel: PropTypes.string,
  activeStory: PropTypes.string,
  activeTab: PropTypes.object,
  scrollPosition: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  goBack: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileContainer);

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Panel,
  PanelHeaderSimple,
  Epic,
  Tabs,
  TabsItem,
  Separator,
  HorizontalScroll
} from "@vkontakte/vkui";
import {
  setPage,
  goBack,
  setStory,
  setActiveTab
} from "../../store/router/actions";
import "@vkontakte/vkui/dist/vkui.css";
import EpicTabbar from "../../components/EpicTabbar/EpicTabbar";
import Petitions from "../../components/Petitions/Petitions";

const MobileContainer = ({
  activePanel,
  setStory,
  activeStory,
  setActiveTab,
  activeTab
}) => {
  return (
    <Epic
      activeStory={activeStory}
      tabbar={<EpicTabbar activeStory={activeStory} setStory={setStory} />}
    >
      <Petitions
        id="petitions"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        activePanel={activePanel}
      />
      <View id="discover" activePanel="discover">
        <Panel id="discover">
          <PanelHeaderSimple>Поиск</PanelHeaderSimple>
        </Panel>
      </View>
    </Epic>
  );
};

const mapStateToProps = state => {
  return {
    activeView: state.router.activeView,
    activePanel: state.router.activePanel,
    activeStory: state.router.activeStory,
    activeTab: state.router.activeTab
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ goBack, setPage, setStory, setActiveTab }, dispatch)
  };
}

MobileContainer.propTypes = {
  activePanel: PropTypes.string,
  setStory: PropTypes.func,
  activeStory: PropTypes.string,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileContainer);

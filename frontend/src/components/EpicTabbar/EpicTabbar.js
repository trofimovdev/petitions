import React from "react";
import { FixedLayout, Tabbar, TabbarItem } from "@vkontakte/vkui";
import "./EpicTabbar.css";
import PropTypes from "prop-types";
import Icon28WriteSquareOutline from "@vkontakte/icons/dist/28/write_square_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setStory } from "../../store/router/actions";

const api = new VKMiniAppAPI();

const EpicTabbar = ({ setStory, activeStory }) => (
  <FixedLayout vertical="bottom" className="Tabbar">
    <Tabbar className="EpicTabbar">
      <TabbarItem
        onClick={() => {
          setStory("petitions", "feed");
          api.selectionChanged().catch(() => {});
        }}
        selected={activeStory === "petitions"}
        data-story="petitionsTab"
        text="Петиции"
      >
        <Icon28WriteSquareOutline />
      </TabbarItem>
      <TabbarItem
        onClick={() => {
          setStory("management", "feed");
          api.selectionChanged().catch(() => {});
        }}
        selected={activeStory === "management"}
        data-story="management"
        text="Управление"
      >
        <Icon28SettingsOutline />
      </TabbarItem>
    </Tabbar>
  </FixedLayout>
);

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setStory
      },
      dispatch
    )
  };
};

EpicTabbar.propTypes = {
  setStory: PropTypes.func.isRequired,
  activeStory: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EpicTabbar);

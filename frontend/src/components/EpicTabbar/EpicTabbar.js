import React from "react";
import {FixedLayout, Tabbar, TabbarItem} from "@vkontakte/vkui";
import "./EpicTabbar.css";
import PropTypes from "prop-types";

import Icon28WriteSquareOutline from "@vkontakte/icons/dist/28/write_square_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

const api = new VKMiniAppAPI();

const EpicTabbar = ({ setStory, activeStory }) => (
  <FixedLayout vertical="bottom" className="Tabbar">
    <Tabbar className="EpicTabbar">
      <TabbarItem
        onClick={() => {
          api.selectionChanged().catch(() => {});
          setStory("petitions", "feed");
        }}
        selected={activeStory === "petitions"}
        data-story="petitionsTab"
        text="Петиции"
      >
        <Icon28WriteSquareOutline />
      </TabbarItem>
      <TabbarItem
        onClick={() => {
          api.selectionChanged().catch(() => {});
          setStory("management", "feed");
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

EpicTabbar.propTypes = {
  setStory: PropTypes.func.isRequired,
  activeStory: PropTypes.string.isRequired
};

export default EpicTabbar;

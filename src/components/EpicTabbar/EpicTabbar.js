import React from "react";
import { Tabbar, TabbarItem } from "@vkontakte/vkui";
import PropTypes from "prop-types";

import Icon28WriteSquareOutline from "@vkontakte/icons/dist/28/write_square_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";

const EpicTabbar = ({ setStory, activeStory }) => (
  <Tabbar>
    <TabbarItem
      onClick={() => setStory("petitions")}
      selected={activeStory === "petitions"}
      data-story="petitions"
      text="Петиции"
    >
      <Icon28WriteSquareOutline />
    </TabbarItem>
    <TabbarItem
      onClick={() => setStory("management")}
      selected={activeStory === "management"}
      data-story="management"
      text="Управление"
    >
      <Icon28SettingsOutline />
    </TabbarItem>
  </Tabbar>
);

EpicTabbar.propTypes = {
  setStory: PropTypes.func.isRequired,
  activeStory: PropTypes.string.isRequired
};

export default EpicTabbar;

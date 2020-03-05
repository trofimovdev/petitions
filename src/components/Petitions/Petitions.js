import React from "react";
import {
  HorizontalScroll,
  Panel,
  PanelHeaderSimple,
  Separator,
  Tabs,
  TabsItem,
  View,
  Group
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import PetitionCard from "../PetitionCard/PetitionCard";

const Petitions = ({ id, setActiveTab, activeTab, activePanel }) => (
  <View id={id} activePanel={activePanel} header={false}>
    <Panel id="feed" separator={false}>
      <PanelHeaderSimple separator={false}>Петиции</PanelHeaderSimple>
      <Tabs>
        <HorizontalScroll>
          <TabsItem
            onClick={() => setActiveTab("feed", "popular")}
            selected={activeTab.feed === "popular"}
          >
            Популярные
          </TabsItem>
          <TabsItem
            onClick={() => setActiveTab("feed", "last")}
            selected={activeTab.feed === "last"}
          >
            Последние
          </TabsItem>
          <TabsItem
            onClick={() => setActiveTab("feed", "signed")}
            selected={activeTab.feed === "signed"}
          >
            Подписанные
          </TabsItem>
        </HorizontalScroll>
      </Tabs>
      <Separator />
      <Group>
        <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
      </Group>
    </Panel>
  </View>
);

Petitions.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired
};

export default Petitions;

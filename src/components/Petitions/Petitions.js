import React from "react";
import {
  HorizontalScroll,
  Panel,
  PanelHeaderSimple,
  Separator,
  Tabs,
  TabsItem,
  View,
  FixedLayout
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import PetitionCard from "../PetitionCard/PetitionCard";

const Petitions = ({ id, setActiveTab, activeTab, activePanel }) => (
  <View id={id} activePanel={activePanel} header={false}>
    <Panel id="feed" separator={false}>
      <PanelHeaderSimple separator={false}>Петиции</PanelHeaderSimple>
      <FixedLayout style={{ marginTop: `-18px` }} vertical="top">
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
      </FixedLayout>
      <Separator style={{ marginTop: `30px` }} />
      <div>
        <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
        <Separator />
        <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
      </div>
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

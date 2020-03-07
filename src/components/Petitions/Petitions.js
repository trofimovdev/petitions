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

const Petitions = ({ id, setActiveTab, activeTab, activePanel }) => {
  return (
    <View id={id} activePanel={activePanel} header={false}>
      <Panel id="feed" separator={false}>
        <PanelHeaderSimple separator={false}>Петиции</PanelHeaderSimple>
        <FixedLayout style={{ marginTop: `-15px` }} vertical="top" id="TESTING">
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
        <Separator style={{ marginTop: `33px` }} />
        {activeTab.feed === "popular" && (
          <div id="LOL">
            <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
            <Separator />
            <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
          </div>
        )}

        {activeTab.feed === "last" && (
          <div>
            <PetitionCard title='"Мой пёс — не чемодан!": Требуем у Аэрофлота ответа' />
            <Separator />
            <PetitionCard title='Мой пёс — не чемодан!": Требуем у Аэрофлота ответа' />
          </div>
        )}

        {activeTab.feed === "signed" && (
          <div>
            <PetitionCard title="Выпустить девятый эпизод по сценарию Колина Треворроу" />
            <Separator />
            <PetitionCard title="Выпустить девятый эпизод по сценарию Колина Треворроу" />
          </div>
        )}
      </Panel>
    </View>
  );
};

Petitions.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired
};

export default Petitions;

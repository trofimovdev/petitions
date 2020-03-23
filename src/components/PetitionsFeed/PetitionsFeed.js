import React from "react";
import {
  HorizontalScroll,
  Panel,
  PanelHeaderSimple,
  Separator,
  Tabs,
  TabsItem,
  FixedLayout
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import PetitionCard from "../PetitionCard/PetitionCard";
import EpicTabbar from "../EpicTabbar/EpicTabbar";

const PetitionsFeed = ({
  id,
  setActiveTab,
  activeTab,
  activePanel,
  setPage,
  activeStory,
  setStory,
  api
}) => {
  return (
    <Panel id={id} separator={false}>
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
          <PetitionCard
            id={1}
            title="Поместить Кобе Брайанта на новый логотип НБА"
            numberOfSignatures={100000}
            totalSignatures={40000}
            activePanel={activePanel}
            setPage={setPage}
            managementDots={false}
          />
          <Separator />
          <PetitionCard
            id={2}
            title="Поместить Кобе Брайанта на новый логотип НБА"
            numberOfSignatures={1000}
            totalSignatures={25000}
            activePanel={activePanel}
            setPage={setPage}
            managementDots={false}
          />
        </div>
      )}
      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

PetitionsFeed.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
};

export default PetitionsFeed;

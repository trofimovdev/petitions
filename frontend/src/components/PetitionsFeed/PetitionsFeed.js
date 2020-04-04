import React, { Fragment } from "react";
import {
  HorizontalScroll,
  Panel,
  PanelHeaderSimple,
  Separator,
  Tabs,
  TabsItem,
  FixedLayout,
  getClassName,
  usePlatform
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetititonsFeed.css";
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
  petitions
}) => {
  const platform = usePlatform();
  console.log("AJSDHGSAFDJHGAFSDGJFASGDFJHASd", petitions);
  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple separator={false}>Петиции</PanelHeaderSimple>
      <FixedLayout
        className={getClassName("PetitionsTabs", platform)}
        vertical="top"
      >
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

      {activeTab.feed === "last" && (
        <div>
          {petitions.last.map((item, index) => {
            console.log(index, item);
            return (
              <div key={index}>
                <PetitionCard
                  id={item.id}
                  title={item.title}
                  numberOfSignatures={item.count_signatures}
                  totalSignatures={item.need_signatures}
                  mobilePhotoUrl={item.mobile_photo_url}
                  activePanel={activePanel}
                  setPage={setPage}
                  managementDots={false}
                />
                <Separator />
              </div>
            );
          })}
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
  setPage: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired
};

export default PetitionsFeed;

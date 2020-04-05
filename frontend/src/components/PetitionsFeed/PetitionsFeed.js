import React, {useEffect, useState} from "react";
import {
  HorizontalScroll,
  Panel,
  PanelHeaderSimple,
  PullToRefresh,
  Separator,
  Tabs,
  TabsItem
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
  const screenHeight = document.body.getBoundingClientRect().height;

  const [fetchingStatus, setFetchingStatus] = useState(false);

  const onRefresh = () => {
    console.log("refresh");
    setFetchingStatus(true);
    setTimeout(function() {
      setFetchingStatus(false);
    }, 1000);
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    console.log(scrollPosition);
    if ((scrollPosition / 313) % 10 > 4) {
      // 313 - высота одной карточки с отступами в px, 10 - кол-во карточек на один запрос
      // > 4 - загружать новые карточки когда юзер переходит на каждую 5 карточку из 10
      // alert("new cards");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple separator>
        Петиции
        <Tabs className="PetitionsTabs__wrapper FixedLayout">
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
      </PanelHeaderSimple>
      <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
        {activeTab.feed === "popular" && (
          <div className="PetitionsFeed">
            {petitions.popular.map((item, index) => {
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
                  {index < petitions.popular.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        )}

        {activeTab.feed === "last" && (
          <div className="PetitionsFeed">
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
                  {index < petitions.last.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        )}

        {activeTab.feed === "signed" && (
          <div className="PetitionsFeed">
            {petitions.signed.map((item, index) => {
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
                  {index < petitions.signed.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        )}
      </PullToRefresh>

      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

PetitionsFeed.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired
};

export default PetitionsFeed;

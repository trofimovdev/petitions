import React, { useEffect, useState } from "react";
import {
  HorizontalScroll,
  Panel,
  PanelHeaderSimple,
  PullToRefresh,
  Separator,
  Tabs,
  TabsItem,
  Footer,
  Spinner,
  getClassName,
  usePlatform
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetititonsFeed.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PetitionCard from "../PetitionCard/PetitionCard";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import FriendsCard from "../FriendsCard/FriendsCard";
import { setLaunchParameters } from "../../store/data/actions";

const api = new VKMiniAppAPI();

const PetitionsFeed = ({
  id,
  setActiveTab,
  activeTab,
  activeView,
  setPage,
  activeStory,
  setStory,
  petitions,
  setCurrent,
  activePanel,
  data
}) => {
  const screenHeight = document.body.getBoundingClientRect().height;
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isFriendsCardVisibile, setIsFriendsCardVisibile] = useState(true);

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
    const cardHeight = 313; // 313 - высота одной карточки в px (с отступами)
    if (
      petitions[activeTab.feed].length * cardHeight - scrollPosition <
      cardHeight * 5
    ) {
      // загружать новые карточки когда юзер пролистнет 5 карточку
      console.log(
        "new cards",
        activeTab.feed,
        petitions[activeTab.feed].length
      );
    }
  };

  const friendsCardOnClose = () => {
    setIsFriendsCardVisibile(false);
  };

  const friendsCardOnClick = () => {
    api
      .getAccessToken(7338958, "friends")
      .then(r => {
        if (!r.scope.includes("friends")) {
          return;
        }
        setLaunchParameters({
          ...data.launchParameters,
          vk_access_token_settings: data.launchParameters.vk_access_token_settings
            .split(",")
            .concat("friends")
            .join(",")
        });
        setIsFriendsCardVisibile(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  useEffect(() => {
    console.log("activePanel from feed", activePanel);
    if (activePanel === "feed") {
      api.setLocationHash(activeTab.feed);
    }
  }, [activeTab, activePanel]);

  const platform = usePlatform();

  return (
    <Panel id={id} className="PetitionsFeed" separator={false}>
      <PanelHeaderSimple separator>
        <div>
          Петиции
          <Tabs
            className={`${getClassName(
              "PetitionsTabs__wrapper",
              platform
            )} FixedLayout`}
          >
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
        </div>
      </PanelHeaderSimple>
      {petitions.popular !== undefined &&
      petitions.last !== undefined &&
      petitions.signed !== undefined ? (
        <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
          {!isFriendsCardVisibile ||
            (!data.launchParameters.vk_access_token_settings.includes(
              "friends"
            ) && (
              <FriendsCard
                onClose={friendsCardOnClose}
                onClick={friendsCardOnClick}
              />
            ))}
          {activeTab.feed === "popular" && (
            <>
              <div className="PetitionsFeed">
                {petitions.popular.map((item, index) => {
                  return (
                    <div key={index}>
                      <PetitionCard
                        id={item.id}
                        title={item.title}
                        numberOfSignatures={item.count_signatures}
                        totalSignatures={item.need_signatures}
                        mobilePhotoUrl={item.mobile_photo_url}
                        activeView={activeView}
                        setPage={setPage}
                      />
                      {index < petitions.popular.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>
              {petitions.popular.length > 0 && (
                <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
              )}
              {petitions.popular.length === 0 && (
                <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
              )}
            </>
          )}

          {activeTab.feed === "last" && (
            <>
              <div className="PetitionsFeed">
                {petitions.last.map((item, index) => {
                  return (
                    <div key={index}>
                      <PetitionCard
                        id={item.id}
                        title={item.title}
                        numberOfSignatures={item.count_signatures}
                        totalSignatures={item.need_signatures}
                        mobilePhotoUrl={item.mobile_photo_url}
                        activeView={activeView}
                        setPage={setPage}
                        setCurrent={setCurrent}
                      />
                      {index < petitions.last.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>
              {petitions.last.length > 0 && (
                <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
              )}
              {petitions.last.length === 0 && (
                <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
              )}
            </>
          )}

          {activeTab.feed === "signed" && (
            <>
              <div className="PetitionsFeed">
                {petitions.signed.map((item, index) => {
                  return (
                    <div key={index}>
                      <PetitionCard
                        id={item.id}
                        title={item.title}
                        numberOfSignatures={item.count_signatures}
                        totalSignatures={item.need_signatures}
                        mobilePhotoUrl={item.mobile_photo_url}
                        activeView={activeView}
                        setPage={setPage}
                        setCurrent={setCurrent}
                      />
                      {index < petitions.signed.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>
              {petitions.signed.length > 0 && (
                <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
              )}
              {petitions.signed.length === 0 && (
                <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
              )}
            </>
          )}
        </PullToRefresh>
      ) : (
        <Spinner size="regular" className="PetitionsFeed__spinner" />
      )}

      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

PetitionsFeed.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activeView: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  setPopout: PropTypes.func.isRequired
};

export default PetitionsFeed;

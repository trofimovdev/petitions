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
  usePlatform,
  FixedLayout
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetititonsFeed.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { connect } from "react-redux";
import ErrorCard from "../ErrorCard/ErrorCard";
import PetitionCard from "../PetitionCard/PetitionCard";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import FriendsCard from "../FriendsCard/FriendsCard";
import { setActiveTab, setPage, setStory } from "../../store/router/actions";
import { setPopular, setLast, setSigned } from "../../store/petitions/actions";
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const PetitionsFeed = ({
  id,
  setActiveTab,
  activeTab,
  activeStory,
  setStory,
  currentPetitions,
  activePanel,
  launchParameters,
  setPopular,
  setLast,
  setSigned,
  initError
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [endStatus, setEndStatus] = useState(false);

  const setCurrentPetitions = petitions => {
    switch (activeTab.feed) {
      case "popular":
        setPopular(petitions);
        break;

      default:
      case "last":
        setLast(petitions);
        break;

      case "signed":
        setSigned(petitions);
        break;
    }
  };

  const onRefresh = () => {
    setFetchingStatus(true);
    loadPetitions(
      "petitions",
      launchParameters.vk_access_token_settings.includes("friends"),
      {
        type: activeTab.feed
      }
    )
      .then(response => {
        setFetchingStatus(false);
        setCurrentPetitions(response);
        api.selectionChanged().catch(() => {});
      })
      .catch(() => {});
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    const petitionsContainer = document.getElementById("petitionsContainer");

    if (!petitionsContainer) {
      return;
    }
    const petitionsContainerHeight = petitionsContainer.offsetHeight;

    if (
      currentPetitions &&
      currentPetitions.length >= 10 &&
      scrollPosition + 1300 > petitionsContainerHeight &&
      !loadingStatus &&
      !endStatus
    ) {
      // загружать новые карточки когда юзер пролистнет 5 карточку
      setLoadingStatus(true);
      loadPetitions(
        "petitions",
        launchParameters.vk_access_token_settings.includes("friends"),
        {
          offset: currentPetitions.length,
          type: activeTab.feed
        }
      )
        .then(r => {
          if (r.length === 0) {
            setEndStatus(true);
            return;
          }
          const petitions = currentPetitions
            .concat(r)
            .filter((value, index, self) => {
              return self.indexOf(value) === index;
            });
          setCurrentPetitions(petitions);
          setLoadingStatus(false);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  useEffect(() => {
    if (activePanel === "feed") {
      window.history.replaceState(null, null);
      api.setLocationHash(activeTab.feed);
    }
    return () => {};
  }, [activeTab, activePanel]);

  const platform = usePlatform();

  return (
    <Panel
      id={id}
      className={!launchParameters.vk_group_id ? "PetitionsFeed" : ""}
      separator={false}
    >
      <PanelHeaderSimple separator>
        <div>
          Петиции
          {!launchParameters.vk_group_id && (
            <FixedLayout
              className={`${getClassName("PetitionsTabs__wrapper", platform)}`}
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
          )}
        </div>
      </PanelHeaderSimple>
      {initError ? (
        <ErrorCard />
      ) : currentPetitions !== undefined ? (
        <PullToRefresh
          onRefresh={onRefresh}
          isFetching={fetchingStatus}
          id="petitionsContainer"
        >
          <FriendsCard />
          {currentPetitions.map((item, index) => {
            return (
              <div key={index}>
                <PetitionCard
                  id={item.id}
                  title={item.title}
                  countSignatures={item.count_signatures}
                  needSignatures={item.need_signatures}
                  mobilePhotoUrl={item.mobile_photo_url}
                  friends={item.friends || []}
                  completed={item.completed}
                />
                {index < currentPetitions.length - 1 && <Separator />}
              </div>
            );
          })}
          {currentPetitions.length === 0 && activeTab.feed === "popular" ? (
            <Footer>Скоро здесь будут популярные петиции</Footer>
          ) : currentPetitions.length === 0 && activeTab.feed === "signed" ? (
            <Footer>Пока что Вы не подписали ни одной петиции</Footer>
          ) : currentPetitions.length === 0 && activeTab.feed === "last" ? (
            <Footer>Пока что нет ни одной петиции</Footer>
          ) : (currentPetitions.length > 0 && endStatus) ||
            (currentPetitions.length > 0 &&
              currentPetitions.length < 10 &&
              !endStatus) ? (
            <></>
          ) : (
            <Spinner
              size="regular"
              className="PetitionsFeed__spinner__bottom"
            />
          )}
        </PullToRefresh>
      ) : (
        <Spinner size="regular" className="PetitionsFeed__spinner" />
      )}

      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory,
    activePanel: state.router.activePanel,
    currentPetitions: state.petitions[state.router.activeTab.feed],
    launchParameters: state.data.launchParameters,
    initError: state.data.initError
  };
};

const mapDispatchToProps = {
  setActiveTab,
  setStory,
  setPage,
  setPopular,
  setLast,
  setSigned
};

PetitionsFeed.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  currentPetitions: PropTypes.array,
  activePanel: PropTypes.string.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  initError: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionsFeed);

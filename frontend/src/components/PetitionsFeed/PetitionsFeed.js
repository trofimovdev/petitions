import React, { useEffect, useState, useCallback } from "react";
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
import { bindActionCreators } from "redux";
import SwipeableViews from "react-swipeable-views";
import smoothscroll from "smoothscroll-polyfill";
import ErrorCard from "../ErrorCard/ErrorCard";
import PetitionCard from "../PetitionCard/PetitionCard";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import FriendsCard from "../FriendsCard/FriendsCard";
import { setActiveTab, setPage, setStory } from "../../store/router/actions";
import { setPopular, setLast, setSigned } from "../../store/petitions/actions";
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();
smoothscroll.polyfill();

const PetitionsFeed = ({
  id,
  setActiveTab,
  activeTab,
  activeStory,
  setStory,
  activePanel,
  launchParameters,
  setPopular,
  setLast,
  setSigned,
  initError,
  popularPetitions,
  lastPetitions,
  signedPetitions
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [endStatus, setEndStatus] = useState(false);
  const [indexTab, setIndexTab] = useState(
    activeTab.feed === "popular"
      ? 0
      : activeTab.feed === "last"
      ? 1
      : activeTab.feed === "signed"
      ? 2
      : 1
  );

  const handleChangeIndex = useCallback(
    event => {
      const HS = document.getElementsByClassName("HorizontalScroll__in")[0];
      switch (event) {
        case 0:
        case "popular":
          setIndexTab(0);
          setActiveTab("feed", "popular");
          HS.scroll({ top: 0, left: 0, behavior: "smooth" });
          break;

        default:
        case 1:
        case "last":
          setIndexTab(1);
          setActiveTab("feed", "last");
          HS.scroll({ top: 0, left: 4, behavior: "smooth" });
          break;

        case 2:
        case "signed":
          setIndexTab(2);
          setActiveTab("feed", "signed");
          HS.scroll({ top: 0, left: 8, behavior: "smooth" });
          break;
      }
    },
    [setActiveTab]
  );

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
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      loadPetitions("petitions", true, {
        type: activeTab.feed
      })
        .then(response => {
          setFetchingStatus(false);
          setCurrentPetitions(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    } else {
      loadPetitions("petitions", false, {
        type: activeTab.feed
      })
        .then(response => {
          setFetchingStatus(false);
          setCurrentPetitions(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    }
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    const petitionsContainer = document.getElementById("petitionsContainer");

    if (!petitionsContainer) {
      return;
    }
    const petitionsContainerHeight = petitionsContainer.offsetHeight;

    let currentPetitions = [];
    switch (activeTab.feed) {
      case "popular":
        currentPetitions = popularPetitions;
        break;

      default:
      case "last":
        currentPetitions = lastPetitions;
        break;

      case "signed":
        currentPetitions = signedPetitions;
        break;
    }

    if (
      currentPetitions &&
      currentPetitions.length >= 10 &&
      scrollPosition + 1300 > petitionsContainerHeight &&
      !loadingStatus &&
      !endStatus
    ) {
      // загружать новые карточки когда юзер пролистнет 5 карточку
      setLoadingStatus(true);
      if (launchParameters.vk_access_token_settings.includes("friends")) {
        loadPetitions("petitions", true, {
          offset: currentPetitions.length,
          type: activeTab.feed
        })
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
      } else {
        loadPetitions("petitions", false, {
          offset: currentPetitions.length,
          type: activeTab.feed
        })
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
  }, [activePanel, activeTab.feed]);

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
                    onClick={() => handleChangeIndex(0)}
                    selected={activeTab.feed === "popular"}
                  >
                    Популярные
                  </TabsItem>
                  <TabsItem
                    onClick={() => handleChangeIndex(1)}
                    selected={activeTab.feed === "last"}
                  >
                    Последние
                  </TabsItem>
                  <TabsItem
                    onClick={() => handleChangeIndex(2)}
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
      <PullToRefresh
        onRefresh={onRefresh}
        isFetching={fetchingStatus}
        id="petitionsContainer"
      >
        {!launchParameters.vk_group_id ? (
          <SwipeableViews index={indexTab} onChangeIndex={handleChangeIndex}>
            {[popularPetitions, lastPetitions, signedPetitions].map(
              (currentPetitions, i) => {
                if (initError) {
                  return (
                    <div key={i}>
                      <ErrorCard />
                    </div>
                  );
                }
                if (!currentPetitions) {
                  return (
                    <div key={i}>
                      <Spinner
                        size="regular"
                        className="PetitionsFeed__spinner"
                      />
                    </div>
                  );
                }
                return (
                  <div key={i}>
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
                    {currentPetitions.length === 0 &&
                    activeTab.feed === "popular" ? (
                      <Footer>Скоро здесь будут популярные петиции</Footer>
                    ) : currentPetitions.length === 0 &&
                      activeTab.feed === "signed" ? (
                      <Footer>Пока что Вы не подписали ни одной петиции</Footer>
                    ) : currentPetitions.length === 0 &&
                      activeTab.feed === "last" ? (
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
                  </div>
                );
              }
            )}
          </SwipeableViews>
        ) : (
          <>
            {initError ? (
              <ErrorCard />
            ) : !lastPetitions ? (
              <Spinner size="regular" className="PetitionsFeed__spinner" />
            ) : (
              <>
                <FriendsCard />
                {lastPetitions.map((item, index) => {
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
                      {index < lastPetitions.length - 1 && <Separator />}
                    </div>
                  );
                })}
                {lastPetitions.length === 0 ? (
                  <Footer>Пока что нет ни одной петиции</Footer>
                ) : (lastPetitions.length > 0 && endStatus) ||
                  (lastPetitions.length > 0 &&
                    lastPetitions.length < 10 &&
                    !endStatus) ? (
                  <></>
                ) : (
                  <Spinner
                    size="regular"
                    className="PetitionsFeed__spinner__bottom"
                  />
                )}
              </>
            )}
          </>
        )}
      </PullToRefresh>

      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory,
    activePanel: state.router.activePanel,
    launchParameters: state.data.launchParameters,
    initError: state.data.initError,
    popularPetitions: state.petitions.popular,
    lastPetitions: state.petitions.last,
    signedPetitions: state.petitions.signed
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setActiveTab,
        setStory,
        setPage,
        setPopular,
        setLast,
        setSigned
      },
      dispatch
    )
  };
};

PetitionsFeed.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  initError: PropTypes.bool,
  popularPetitions: PropTypes.array,
  lastPetitions: PropTypes.array,
  signedPetitions: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionsFeed);

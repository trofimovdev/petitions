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
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
  setSigned
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [endStatus, setEndStatus] = useState(false);

  const setCurrentPetitions = petitions => {
    switch (activeTab.feed) {
      case "popular":
        setPopular(petitions);
        break;

      case "last":
        setLast(petitions);
        break;

      case "signed":
        setSigned(petitions);
        break;

      default:
        setLast(petitions);
    }
  };

  const onRefresh = () => {
    setFetchingStatus(true);
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      loadPetitions("petitions", true, { type: activeTab.feed })
        .then(response => {
          setFetchingStatus(false);
          setCurrentPetitions(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    } else {
      loadPetitions("petitions", false, { type: activeTab.feed })
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
    const petitionsContainerHeight = document.getElementById(
      "petitionsContainer"
    ).offsetHeight;
    if (
      currentPetitions &&
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
      {currentPetitions !== undefined ? (
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
          {currentPetitions.length === 0 ? (
            <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
          ) : (currentPetitions.length > 0 && endStatus) ||
            (currentPetitions.length > 0 &&
              currentPetitions.length < 10 &&
              !endStatus) ? (
            <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
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
    launchParameters: state.data.launchParameters
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
  currentPetitions: PropTypes.array,
  activePanel: PropTypes.string.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionsFeed);

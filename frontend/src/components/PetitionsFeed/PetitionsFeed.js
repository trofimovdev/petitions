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
import {
  setCurrent,
  setPopular,
  setLast,
  setSigned
} from "../../store/petitions/actions";
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const PetitionsFeed = ({
  id,
  setActiveTab,
  activeTab,
  activeView,
  setPage,
  activeStory,
  setStory,
  currentPetitions,
  setCurrent,
  activePanel,
  launchParameters,
  setPopular,
  setLast,
  setSigned
}) => {
  const screenHeight = document.body.getBoundingClientRect().height;
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

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
    console.log("refresh");
    setFetchingStatus(true);
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      console.log("with friends");
      loadPetitions("petitions", true, { type: activeTab.feed })
        .then(response => {
          console.log("SET CURRENT PETITIONS FROM REFRESH", response);
          setFetchingStatus(false);
          setCurrentPetitions(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(e => console.log(e));
    } else {
      console.log("without friends");
      loadPetitions("petitions", false, { type: activeTab.feed })
        .then(response => {
          console.log("SET CURRENT PETITIONS FROM REFRESH WITHOUT FRINEDS", response);
          setFetchingStatus(false);
          setCurrentPetitions(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(e => console.log(e));
    }
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    console.log(scrollPosition);
    const cardHeight = 313; // 313 - высота одной карточки в px (с отступами)
    if (
      currentPetitions.length * cardHeight - scrollPosition < cardHeight * 5 &&
      !loadingStatus
    ) {
      // загружать новые карточки когда юзер пролистнет 5 карточку
      console.log("new cards", activeTab.feed, currentPetitions.length);
      setLoadingStatus(true);
      // if (launchParameters.vk_access_token_settings.includes("friends")) {
      //   console.log("with friends");
      //   loadPetitions("petitions", true, { type: activeTab.feed })
      //     .then(r => console.log(r))
      //     .catch(e => console.log(e));
      // } else {
      //   console.log("without friends");
      //   loadPetitions("petitions", false, { type: activeTab.feed })
      //     .then(r => {
      //       console.log(r);
      //     })
      //     .catch(e => console.log(e));
      // }
    }
  };

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
        <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
          <FriendsCard setLoadingStatus={setLoadingStatus} />
          {currentPetitions.map((item, index) => {
            console.log(item);
            return (
              <div key={index}>
                <PetitionCard
                  id={item.id}
                  title={item.title}
                  countSignatures={item.count_signatures}
                  needSignatures={item.need_signatures}
                  mobilePhotoUrl={item.mobile_photo_url}
                  friends={item.friends || []}
                />
                {index < currentPetitions.length - 1 && <Separator />}
              </div>
            );
          })}
          {currentPetitions.length > 0 && (
            <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
          )}
          {currentPetitions.length === 0 && (
            <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
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
    activeView: state.router.activeView,
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
        setCurrent,
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
  activeView: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  currentPetitions: PropTypes.array,
  setCurrent: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionsFeed);

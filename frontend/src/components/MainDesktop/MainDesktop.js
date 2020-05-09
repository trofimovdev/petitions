import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TabList, TabItem, Link } from "@happysanta/vk-app-ui";
import {
  Div,
  Footer,
  Placeholder,
  PullToRefresh,
  Separator,
  Spinner
} from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/16/add";
import "./MainDesktop.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import FriendsCard from "../FriendsCard/FriendsCard";
import PetitionCardDesktop from "../PetitionCardDesktop/PetitionCardDesktop";
import { setActiveTab, setPage } from "../../store/router/actions";
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const MainDesktop = ({
  id,
  activeTab,
  setActiveTab,
  currentPetitions,
  activeView,
  activePanel,
  setPage,
  setPopular,
  setLast,
  setSigned,
  setManaged,
  launchParameters
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [endStatus, setEndStatus] = useState(false);
  const [popout, setPopout] = useState(null);

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

      case "managed":
        setManaged(petitions);
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

  useEffect(() => {
    api.setLocationHash(activeTab);
  }, [activeTab]);

  console.log("activePanel", activePanel);
  console.log("activeView", activeView);

  return (
    <div id={id} className="DesktopContainer">
      <TabList
        after={
          <Link
            className="create"
            onClick={() => {
              setPage("edit", "");
            }}
          >
            <Icon24Add className="create__icon" />
            Создать петицию
          </Link>
        }
      >
        <TabItem
          selected={activeTab === "popular"}
          onClick={() => {
            setActiveTab("feed", "popular");
          }}
        >
          Популярные
        </TabItem>
        <TabItem
          selected={activeTab === "last"}
          onClick={() => {
            setActiveTab("feed", "last");
          }}
        >
          Последние
        </TabItem>
        <TabItem
          selected={activeTab === "signed"}
          onClick={() => {
            setActiveTab("feed", "signed");
          }}
        >
          Подписанные
        </TabItem>
        <TabItem
          selected={activeTab === "managed"}
          onClick={() => {
            setActiveTab("feed", "managed");
          }}
        >
          Мои петиции
        </TabItem>
      </TabList>
      <Div className="wrapper">
        {currentPetitions !== undefined ? (
          <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
            <FriendsCard />
            {currentPetitions.map((item, index) => {
              return (
                <div key={index}>
                  <PetitionCardDesktop
                    id={item.id}
                    title={item.title}
                    countSignatures={item.count_signatures}
                    needSignatures={item.need_signatures}
                    webPhotoUrl={item.web_photo_url}
                    friends={item.friends || []}
                    completed={item.completed}
                    managementArrow={activeTab === "managed"}
                    setPopout={setPopout}
                  />
                  {index < currentPetitions.length - 1 && <Separator />}
                </div>
              );
            })}
            {currentPetitions.length === 0 ? (
              activeTab === "managed" ? (
                <Placeholder stretched>
                  <Footer>Создавайте петиции, чтобы решать реальные проблемы</Footer>
                </Placeholder>
              ) : (
                <Placeholder stretched>
                  <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
                </Placeholder>
              )
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
      </Div>
      {popout}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeTab: state.router.activeTab.feed,
    currentPetitions: state.petitions[state.router.activeTab.feed],
    activeView: state.router.activeView,
    activePanel: state.router.activePanel,
    launchParameters: state.data.launchParameters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setActiveTab,
        setPage
      },
      dispatch
    )
  };
};

MainDesktop.propTypes = {
  id: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  currentPetitions: PropTypes.array,
  activeView: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  setManaged: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MainDesktop);

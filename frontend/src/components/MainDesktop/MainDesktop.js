import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TabList, TabItem, Link } from "@happysanta/vk-app-ui";
import { Footer, PullToRefresh, Separator, Spinner } from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/16/add";
import "./MainDesktop.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import FriendsCard from "../FriendsCard/FriendsCard";
import PetitionCardDesktop from "../PetitionCardDesktop/PetitionCardDesktop";
import { setActiveTab } from "../../store/router/actions";

const api = new VKMiniAppAPI();

const MainDesktop = ({ id, activeTab, setActiveTab, currentPetitions, activeView, activePanel }) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [endStatus, setEndStatus] = useState(false);

  useEffect(() => {
    api.setLocationHash(activeTab);
  }, [activeTab]);

  console.log("activePanel", activePanel);
  console.log("activeView", activeView);

  return (
    <div id={id} className="DesktopContainer">
      <TabList
        after={
          <Link className="create">
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
      <div className="wrapper">
        {/* <Spinner /> */}
        {currentPetitions !== undefined ? (
          <PullToRefresh>
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
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeTab: state.router.activeTab.feed,
    currentPetitions: state.petitions[state.router.activeTab.feed],
    activeView: state.router.activeView,
    activePanel: state.router.activePanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setActiveTab
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
  activePanel: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MainDesktop);

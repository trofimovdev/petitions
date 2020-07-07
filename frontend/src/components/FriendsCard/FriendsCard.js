import React from "react";
import { Div, Card, Link } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./FriendsCard.css";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";
import { connect } from "react-redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import {
  setFriendsCardStatus,
  setLaunchParameters
} from "../../store/data/actions";
import {
  setPopular,
  setLast,
  setSigned,
  setManaged
} from "../../store/petitions/actions";
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const FriendsCard = ({
  friendsCardStatus,
  setFriendsCardStatus,
  launchParameters,
  setLaunchParameters,
  setPopular,
  setLast,
  setSigned,
  setManaged,
  activeView,
  activeTab,
  appId
}) => {
  const setCurrentPetitions = petitions => {
    if (activeView === "management") {
      setManaged(petitions);
      return;
    }
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

  const onClick = () => {
    if (friendsCardStatus !== 1) {
      return;
    }
    setFriendsCardStatus(2);
    api
      .getAccessToken(appId, "friends")
      .then(r => {
        if (!r.scope.includes("friends")) {
          setFriendsCardStatus(1);
          return;
        }
        setLaunchParameters({
          ...launchParameters,
          vk_access_token_settings: launchParameters.vk_access_token_settings
            .split(",")
            .concat("friends")
            .join(",")
        });
        loadPetitions("petitions", true, {
          type: activeView === "management" ? "managed" : activeTab.feed
        })
          .then(response => {
            setFriendsCardStatus(0);
            setCurrentPetitions(response);
          })
          .catch(() => setFriendsCardStatus(1));
      })
      .catch(() => setFriendsCardStatus(1));
  };

  const onClose = () => {
    setFriendsCardStatus(0);
    api.selectionChanged().catch(() => {});
  };

  return (
    <>
      {!friendsCardStatus ||
        (!launchParameters.vk_access_token_settings.includes("friends") && (
          <Div className="FriendsCard">
            <Card size="l" className="FriendsCard__card">
              <div
                className="FriendsCard__card__close-button"
                onClick={onClose}
              >
                <Icon16Cancel />
              </div>
              <div className="FriendsCard__card__content">
                Разрешите доступ к списку друзей, чтобы узнать, кто из них уже
                проголосовал
                <Link
                  className="FriendsCard__card__content__link"
                  onClick={onClick}
                >
                  Разрешить доступ
                </Link>
              </div>
            </Card>
          </Div>
        ))}
    </>
  );
};

const mapStateToProps = state => {
  return {
    friendsCardStatus: state.data.friendsCardStatus,
    launchParameters: state.data.launchParameters,
    activeView: state.router.activeView,
    activeTab: state.router.activeTab,
    appId: state.data.appId
  };
};

const mapDispatchToProps = {
  setFriendsCardStatus,
  setLaunchParameters,
  setPopular,
  setLast,
  setSigned,
  setManaged
};

FriendsCard.propTypes = {
  friendsCardStatus: PropTypes.number.isRequired,
  setFriendsCardStatus: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setLaunchParameters: PropTypes.func.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  setManaged: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
  activeTab: PropTypes.object.isRequired,
  appId: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsCard);

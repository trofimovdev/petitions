import React from "react";
import { Div, Card, Link } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./FriendsCard.css";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";
import { bindActionCreators } from "redux";
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
  setLoadingStatus,
  setPopular,
  setLast,
  setSigned,
  setManaged,
  activeView,
  activeTab
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
    setLoadingStatus(true);
    api
      .getAccessToken(7338958, "friends")
      .then(r => {
        if (!r.scope.includes("friends")) {
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
            setFriendsCardStatus(false);
            setLoadingStatus(false);
            setCurrentPetitions(response);
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };

  const onClose = () => {
    setFriendsCardStatus(false);
  };
  console.log(launchParameters, friendsCardStatus);
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
                Разрешите доступ к списку друзей, чтобы узнать кто из них уже
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
    activeTab: state.router.activeTab
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setFriendsCardStatus,
        setLaunchParameters,
        setPopular,
        setLast,
        setSigned,
        setManaged
      },
      dispatch
    )
  };
};
FriendsCard.propTypes = {
  friendsCardStatus: PropTypes.bool.isRequired,
  setFriendsCardStatus: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setLaunchParameters: PropTypes.func.isRequired,
  setLoadingStatus: PropTypes.func.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  setManaged: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
  activeTab: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsCard);

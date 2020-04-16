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

const api = new VKMiniAppAPI();

const FriendsCard = ({
  friendsCardStatus,
  setFriendsCardStatus,
  launchParameters,
  setLaunchParameters
}) => {
  const onClick = () => {
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
        setFriendsCardStatus(false);
      })
      .catch(() => {});
  };

  const onClose = () => {
    setFriendsCardStatus(false);
  };
  console.log(launchParameters, friendsCardStatus);
  return (
    <>
      {!friendsCardStatus ||
        (!launchParameters.vk_access_token_settings.includes(
          "friends"
        ) && (
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
    launchParameters: state.data.launchParameters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setFriendsCardStatus,
        setLaunchParameters
      },
      dispatch
    )
  };
};
FriendsCard.propTypes = {
  friendsCardStatus: PropTypes.bool.isRequired,
  setFriendsCardStatus: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setLaunchParameters: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsCard);

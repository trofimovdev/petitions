import React from "react";
import {
  Div,
  Card,
  UsersStack,
  ScreenSpinner,
  Snackbar,
  Avatar
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionCard.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon28MoreHorizontal from "@vkontakte/icons/dist/28/more_horizontal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import { setPage } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import { declOfNum } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const PetitionCard = ({
  id,
  title,
  countSignatures,
  needSignatures,
  mobilePhotoUrl,
  activeView,
  setPage,
  setCurrent,
  managementDots,
  onManagement,
  friends
}) => {
  console.log("FRIENDS", friends);
  return (
    <Div
      className="PetitionCard"
      onClick={e => {
        console.log(e.target);
        if (
          ["svg", "use", "g", "path"].includes(e.target.tagName) ||
          id === 0
        ) {
          return;
        }
        api.selectionChanged().catch(error => console.log(error));
        setCurrent({ id });
        setPage(activeView, "petition");
      }}
    >
      {managementDots && (
        <div className="PetitionCard__dots" onClick={onManagement}>
          <Icon28MoreHorizontal />
        </div>
      )}
      <h1 className="PetitionCard__title">{title}</h1>
      <div>
        <PetitionProgress
          countSignatures={countSignatures}
          needSignatures={needSignatures}
        />
        <Card
          size="l"
          className="PetitionCard__card"
          style={{ backgroundImage: `url(${mobilePhotoUrl})` }}
        />
        {friends.length > 0 && (
          <UsersStack
            className="PetitionCard__users_stack"
            photos={friends.slice(0, 3).map(item => {
              return item.user.photo_50;
            })}
          >
            {friends.length === 1
              ? (friends[0].user.sex === "2" ? "Подписал " : "Подписала ") +
                friends[0].user.first_name
              : `Подписали ${
                  friends.length === 2
                    ? `${friends[0].user.first_name} и ${friends[1].user.first_name}`
                    : friends
                        .slice(0, 2)
                        .map(item => {
                          return item.user.first_name;
                        })
                        .join(", ")
                }${
                  friends.length > 3
                    ? `, ${friends[2].user.first_name} и еще ${friends.length -
                        3} ${declOfNum(friends.length - 3, [
                        "друг",
                        "друга",
                        "друзей"
                      ])}`
                    : `и ${friends[2].user.first_name}`
                }`}
            {}
          </UsersStack>
        )}
      </div>
    </Div>
  );
};

const mapStateToProps = state => {
  return {
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setPage,
        setCurrent
      },
      dispatch
    )
  };
};

PetitionCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  countSignatures: PropTypes.number.isRequired,
  needSignatures: PropTypes.number.isRequired,
  mobilePhotoUrl: PropTypes.string.isRequired,
  activeView: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  managementDots: PropTypes.bool,
  onManagement: PropTypes.func,
  friends: PropTypes.array
};

PetitionCard.defaultProps = {
  managementDots: false,
  onManagement: () => {},
  friends: []
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionCard);

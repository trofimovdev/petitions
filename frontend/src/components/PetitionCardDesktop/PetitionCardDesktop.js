import React from "react";
import { Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import "./PetitionCardDesktop.css";
import { setCurrent } from "../../store/petitions/actions";
import { setPage } from "../../store/router/actions";
import { declOfNum } from "../../tools/helpers";

const PetitionCardDesktop = ({
  id,
  title,
  countSignatures,
  needSignatures,
  webPhotoUrl,
  setPage,
  setCurrent,
  managementDots,
  onManagement,
  friends,
  completed
}) => {
  return (
    <Div
      className="PetitionCardDesktop"
      onClick={() => {
        setCurrent({ id });
        setPage("petition", "");
      }}
    >
      <div className="PetitionCardDesktop__info">
        <h1 className="PetitionCardDesktop__info__title">
          {title} {id}
        </h1>
        <PetitionProgress
          countSignatures={countSignatures}
          needSignatures={needSignatures}
          completed={completed}
        />
        {friends && friends.length > 0 && (
          <UsersStack
            className="Petition__users_stack"
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
      <Card
        size="l"
        className="PetitionCardDesktop__card"
        style={{
          backgroundImage: `url(${webPhotoUrl})`
        }}
      />
    </Div>
  );
};

const mapStateToProps = state => {
  return {};
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

PetitionCardDesktop.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  countSignatures: PropTypes.number.isRequired,
  needSignatures: PropTypes.number.isRequired,
  webPhotoUrl: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  managementDots: PropTypes.bool,
  onManagement: PropTypes.func,
  friends: PropTypes.array,
  completed: PropTypes.bool.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetitionCardDesktop);

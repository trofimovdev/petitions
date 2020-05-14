import React from "react";
import { Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionCard.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon28MoreHorizontal from "@vkontakte/icons/dist/28/more_horizontal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import { setPage } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import { userStackText } from "../../tools/helpers";

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
  friends,
  completed
}) => {
  return (
    <Div
      className="PetitionCard"
      onClick={e => {
        if (
          ["svg", "use", "g", "path"].includes(e.target.tagName) ||
          id === 0
        ) {
          return;
        }
        api.selectionChanged().catch(() => {});
        setCurrent({ id });
        setPage(activeView, "petition");
      }}
    >
      {managementDots && (
        <div
          className="PetitionCard__dots"
          onClick={() => onManagement(id, completed)}
        >
          <Icon28MoreHorizontal />
        </div>
      )}
      <h1 className="PetitionCard__title">{title}</h1>
      <div>
        <PetitionProgress
          countSignatures={countSignatures}
          needSignatures={needSignatures}
          completed={completed}
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
            {userStackText(friends)}
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
  friends: PropTypes.array,
  completed: PropTypes.bool.isRequired
};

PetitionCard.defaultProps = {
  managementDots: false,
  onManagement: () => {},
  friends: []
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionCard);

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
  onManagement
}) => {
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
        {/* <UsersStack */}
        {/*  className="PetitionCard__users_stack" */}
        {/*  photos={[ */}
        {/*    "https://sun9-6.userapi.com/c846121/v846121540/195e4d/17NeSTKMR1o.jpg?ava=1", */}
        {/*    "https://sun9-30.userapi.com/c845017/v845017447/1773bb/Wyfyi8-7e5A.jpg?ava=1", */}
        {/*    "https://sun9-25.userapi.com/c849432/v849432217/18ad61/0UFtoEhCsgA.jpg?ava=1" */}
        {/*  ]} */}
        {/* > */}
        {/*  Подписали Дмитрий, Анастасия и еще 12 друзей */}
        {/* </UsersStack> */}
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
  onManagement: PropTypes.func
};

PetitionCard.defaultProps = {
  managementDots: false,
  onManagement: () => {}
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionCard);

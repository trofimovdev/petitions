import React from "react";
import { Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { declOfNum } from "../../tools/helpers";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import "./PetitionCardDesktop.css";

const PetitionCardDesktop = ({}) => {
  return (
    <Div className="PetitionCardDesktop">
      <div className="PetitionCardDesktop__info">
        <h1 className="PetitionCardDesktop__info__title">Апостериори, гравитационный парадокс амбивалентно понимает под собой интеллигибельный знак. Интеллект естественно понимает под собой интеллигибельный</h1>
        <PetitionProgress countSignatures={21} needSignatures={2222222} />
      </div>
      <Card
        size="l"
        className="PetitionCardDesktop__card"
        style={{
          backgroundImage: `url(https://petitions.trofimov.dev/static/1360x320.png?1)`
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
    ...bindActionCreators({}, dispatch)
  };
};

PetitionCardDesktop.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetitionCardDesktop);

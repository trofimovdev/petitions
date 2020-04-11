import React from "react";
import { Div, Card, Link } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./FriendsCard.css";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";

const FriendsCard = ({ onClose, onClick }) => {
  return (
    <Div className="FriendsCard">
      <Card size="l" className="FriendsCard__card">
        <div className="FriendsCard__card__close-button" onClick={onClose}>
          <Icon16Cancel />
        </div>
        <div className="FriendsCard__card__content">
          Разрешите доступ к списку друзей, чтобы узнать кто из них уже
          проголосовал
          <Link className="FriendsCard__card__content__link" onClick={onClick}>
            Разрешить доступ
          </Link>
        </div>
      </Card>
    </Div>
  );
};

FriendsCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

export default FriendsCard;

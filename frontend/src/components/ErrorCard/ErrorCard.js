import React from "react";
import "./ErrorCard.css";
import { Card, Div } from "@vkontakte/vkui";

const ErrorCard = () => (
  <Div>
    <Card size="l" className="ErrorCard__card">
      <div className="ErrorCard__card__content">
        <strong>Что-то пошло не так...</strong>
        <br />
        Попробуйте еще раз через несколько минут
      </div>
    </Card>
  </Div>
);

export default ErrorCard;

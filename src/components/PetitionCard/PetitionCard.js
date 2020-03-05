import React from "react";
import { Progress, Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionCard.css";

const PetitionCard = ({ title }) => (
  <Div className="PetitionCard">
    <h1 className="PetitionCard__title">{title}</h1>
    <div>
      <p className="PetitionCard__progress_text">100 000 из 400 000 подписей</p>
      <Progress className="PetitionCard__progress_bar" value={40} />
      <Card
        size="l"
        className="PetitionCard__card"
        style={{ backgroundImage: `url("https://placehold.it/1440x768")` }}
      />
      <UsersStack
        className="PetitionCard__users_stack"
        photos={[
          "https://sun9-6.userapi.com/c846121/v846121540/195e4d/17NeSTKMR1o.jpg?ava=1",
          "https://sun9-30.userapi.com/c845017/v845017447/1773bb/Wyfyi8-7e5A.jpg?ava=1",
          "https://sun9-25.userapi.com/c849432/v849432217/18ad61/0UFtoEhCsgA.jpg?ava=1"
        ]}
      >
        Подписали Дмитрий, Анастасия и еще 12 друзей
      </UsersStack>
    </div>
  </Div>
);

PetitionCard.propTypes = {
  title: PropTypes.string.isRequired
};

export default PetitionCard;

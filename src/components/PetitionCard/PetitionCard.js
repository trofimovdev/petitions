import React from "react";
import { Progress, Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionCard.css";
import test from "../../img/test.jpg";

const PetitionCard = ({
  id,
  title,
  numberOfSignatures,
  totalSignatures,
  setPage,
  activePanel
}) => {
  const declOfNum = n => {
    const titles = ["подписи", "подписей", "подписей"];
    return titles[
      n % 10 === 1 && n % 100 !== 11
        ? 0
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? 1
        : 2
    ];
  };

  const getProgressBarValue = () => {
    return Math.floor((numberOfSignatures / totalSignatures) * 100);
  };

  return (
    <Div
      className="PetitionCard"
      onClick={() => {
        setPage(activePanel, "petition");
        console.log("test");
      }}
    >
      <h1 className="PetitionCard__title">{title}</h1>
      <div>
        <p className="PetitionCard__progress_text">
          {`${numberOfSignatures} из ${totalSignatures} ${declOfNum(
            numberOfSignatures
          )}`}
        </p>
        <Progress
          className={`PetitionCard__progress_bar ${
            numberOfSignatures >= totalSignatures ? "done" : ""
          }`}
          value={getProgressBarValue()}
        />
        <Card
          size="l"
          className="PetitionCard__card"
          style={{ backgroundImage: `url(${test})` }}
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
};

PetitionCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  numberOfSignatures: PropTypes.number.isRequired,
  totalSignatures: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired
};

export default PetitionCard;

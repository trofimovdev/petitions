import React from "react";
import { Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionCard.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PetitionProgress from "../PetitionProgress/PetitionProgress";

const api = new VKMiniAppAPI();

const PetitionCard = ({
  id,
  title,
  numberOfSignatures,
  totalSignatures,
  mobilePhotoUrl,
  activePanel,
  setPage,
  managementDots
}) => {
  return (
    <Div
      className="PetitionCard"
      onClick={() => {
        api.setLocationHash(`p${id.toString()}`).then(() => {
          setPage(activePanel, "petition");
        });
      }}
    >
      <h1 className="PetitionCard__title">{title}</h1>
      <div>
        <PetitionProgress
          numberOfSignatures={numberOfSignatures}
          totalSignatures={totalSignatures}
        />
        <Card
          size="l"
          className="PetitionCard__card"
          style={{ backgroundImage: `url(${mobilePhotoUrl})` }}
        />
        {/*<UsersStack*/}
        {/*  className="PetitionCard__users_stack"*/}
        {/*  photos={[*/}
        {/*    "https://sun9-6.userapi.com/c846121/v846121540/195e4d/17NeSTKMR1o.jpg?ava=1",*/}
        {/*    "https://sun9-30.userapi.com/c845017/v845017447/1773bb/Wyfyi8-7e5A.jpg?ava=1",*/}
        {/*    "https://sun9-25.userapi.com/c849432/v849432217/18ad61/0UFtoEhCsgA.jpg?ava=1"*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  Подписали Дмитрий, Анастасия и еще 12 друзей*/}
        {/*</UsersStack>*/}
      </div>
    </Div>
  );
};

PetitionCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  numberOfSignatures: PropTypes.number.isRequired,
  totalSignatures: PropTypes.number.isRequired,
  mobilePhotoUrl: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  managementDots: PropTypes.bool.isRequired
};

export default PetitionCard;

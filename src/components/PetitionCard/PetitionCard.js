import React from "react";
import { Progress, Div } from "@vkontakte/vkui";
import PropTypes from "prop-types";

const PetitionCard = ({ title }) => (
  <Div style={{ border: "1px solid red" }}>
    <h1>{title}</h1>
    <div>
      100 000 из 400 000 подписей
      <Progress value={40} />
    </div>
  </Div>
);

PetitionCard.propTypes = {
  title: PropTypes.string.isRequired
};

export default PetitionCard;

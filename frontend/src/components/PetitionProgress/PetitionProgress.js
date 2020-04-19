import React from "react";
import { Progress } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionProgress.css";
import { declOfNum } from "../../tools/helpers";

const PetitionProgress = ({ countSignatures, needSignatures }) => {
  const getProgressBarValue = () => {
    return Math.floor((countSignatures / needSignatures) * 100);
  };

  return (
    <div className="PetitionProgress">
      <p className="PetitionProgress__text">
        {`${countSignatures.toLocaleString()} из ${needSignatures.toLocaleString()} ${declOfNum(
          needSignatures,
          ["подписи", "подписей", "подписей"]
        )}`}
      </p>
      <Progress
        className={`PetitionProgress__bar ${
          countSignatures >= needSignatures ? "done" : ""
        }`}
        value={getProgressBarValue()}
      />
    </div>
  );
};

PetitionProgress.propTypes = {
  countSignatures: PropTypes.number.isRequired,
  needSignatures: PropTypes.number.isRequired
};

export default PetitionProgress;

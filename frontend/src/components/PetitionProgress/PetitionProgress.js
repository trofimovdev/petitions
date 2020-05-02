import React from "react";
import { Progress } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionProgress.css";
import { declOfNum } from "../../tools/helpers";

const PetitionProgress = ({ countSignatures, needSignatures, completed }) => {
  const getProgressBarValue = () => {
    return Math.floor((countSignatures / needSignatures) * 100);
  };

  return (
    <div className="PetitionProgress">
      <p className="PetitionProgress__text">
        {`${countSignatures.toLocaleString(
          "ru"
        )} из ${needSignatures.toLocaleString("ru")} ${declOfNum(
          needSignatures,
          ["подписи", "подписей", "подписей"]
        )} ${completed ? "собрано" : ""}`}
      </p>
      <Progress
        className={`PetitionProgress__bar ${
          countSignatures >= needSignatures
            ? "done"
            : completed
            ? "completed"
            : ""
        }`}
        value={getProgressBarValue()}
      />
    </div>
  );
};

PetitionProgress.propTypes = {
  countSignatures: PropTypes.number.isRequired,
  needSignatures: PropTypes.number.isRequired,
  completed: PropTypes.bool
};

export default PetitionProgress;

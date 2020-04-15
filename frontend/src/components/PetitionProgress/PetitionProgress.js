import React from "react";
import { Progress } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionProgress.css";

const PetitionProgress = ({ countSignatures, needSignatures }) => {
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
    return Math.floor((countSignatures / needSignatures) * 100);
  };

  return (
    <div className="PetitionProgress">
      <p className="PetitionProgress__text">
        {`${countSignatures.toLocaleString()} из ${needSignatures.toLocaleString()} ${declOfNum(
          needSignatures
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

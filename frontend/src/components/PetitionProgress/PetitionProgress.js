import React from "react";
import { Progress } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionProgress.css";

const PetitionProgress = ({ numberOfSignatures, totalSignatures }) => {
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
    <div className="PetitionProgress">
      <p className="PetitionProgress__text">
        {`${numberOfSignatures.toLocaleString()} из ${totalSignatures.toLocaleString()} ${declOfNum(
          totalSignatures
        )}`}
      </p>
      <Progress
        className={`PetitionProgress__bar ${
          numberOfSignatures >= totalSignatures ? "done" : ""
        }`}
        value={getProgressBarValue()}
      />
    </div>
  );
};

PetitionProgress.propTypes = {
  numberOfSignatures: PropTypes.number.isRequired,
  totalSignatures: PropTypes.number.isRequired
};

export default PetitionProgress;

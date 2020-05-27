import React from "react";
import { Progress } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./PetitionProgress.css";
import Icon16Done from "@vkontakte/icons/dist/16/done";
import { declOfNum } from "../../tools/helpers";

const PetitionProgress = ({
  countSignatures,
  needSignatures,
  completed,
  signed
}) => {
  const getProgressBarValue = () => {
    return Math.floor((countSignatures / needSignatures) * 100);
  };

  return (
    <div className="PetitionProgress">
      <div className="PetitionProgress__info">
        <p className="PetitionProgress__info__text">
          {`${countSignatures.toLocaleString(
            "ru"
          )} из ${needSignatures.toLocaleString(
            "ru"
          )} ${declOfNum(needSignatures, [
            "подписи",
            "подписей",
            "подписей"
          ])} ${completed ? "собрано" : ""}`}
        </p>
        {signed && (
          <div className="PetitionProgress__info__signed">
            <Icon16Done className="PetitionProgress__info__signed__icon" />
            Вы подписали эту петицию
          </div>
        )}
      </div>
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
  completed: PropTypes.bool,
  signed: PropTypes.bool
};

export default PetitionProgress;

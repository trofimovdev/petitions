import React from "react";
import { Tabbar, Div, Button, FixedLayout } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";

const api = new VKMiniAppAPI();

const PetitionTabbar = ({ openModal }) => {
  return (
    <FixedLayout vertical="bottom" className="Tabbar PetitionTabbar">
      <div className="PetitionTabbar__signed">
        <Icon24DoneOutline className="PetitionTabbar__signed__icon" />
        Вы подписали эту петицию
      </div>
      <Div className="PetitionTabbar__buttons">
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            api.notificationOccurred("success");
          }}
        >
          Подписать
        </Button>
        <Button
          size="l"
          mode="secondary"
          onClick={() => {
            api.selectionChanged();
            console.log("try to open");
            openModal("share-type");
            console.log("opened");
          }}
        >
          <Icon24ShareOutline />
        </Button>
        <Button
          size="l"
          mode="secondary"
          onClick={() => {
            api.selectionChanged();
          }}
        >
          <Icon24Settings />
        </Button>
      </Div>
    </FixedLayout>
  );
};

PetitionTabbar.propTypes = {
  openModal: PropTypes.func.isRequired
};

export default PetitionTabbar;

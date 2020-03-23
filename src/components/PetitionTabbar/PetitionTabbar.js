import React from "react";
import { Tabbar, Div, Button } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

const api = new VKMiniAppAPI();

const PetitionTabbar = () => (
  <Tabbar className="PetitionTabbar">
    <div className="PetitionTabbar__signed">
      <Icon24DoneOutline className="PetitionTabbar__signed__icon"/>
      Вы подписали эту петицию
    </div>
    <Div className="PetitionTabbar__buttons">
      <Button size="xl" mode="primary">
        Подписать
      </Button>
      <Button
        size="l"
        mode="secondary"
        onClick={() => {
          api.shareLink("lolkek");
        }}
      >
        <Icon24ShareOutline />
      </Button>
      <Button size="l" mode="secondary">
        <Icon24Settings />
      </Button>
    </Div>
  </Tabbar>
);

export default PetitionTabbar;

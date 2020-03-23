import React from "react";
import { Tabbar, Div, Button } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

const api = new VKMiniAppAPI();

const PetitionTabbar = () => (
  <Tabbar className="PetitionTabbar">
    <Div className="PetitionTabbar__wrapper">
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
    </Div>
  </Tabbar>
);

export default PetitionTabbar;

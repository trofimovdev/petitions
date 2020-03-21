import React from "react";
import { Tabbar, Div, Button } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import "./PetitionTabbar.css";

const PetitionTabbar = () => (
  <Tabbar>
    <Div className="PetitionTabbar">
      <Button size="xl" mode="primary">
        Подписать
      </Button>
      <Button size="l" mode="secondary">
        <Icon24ShareOutline />
      </Button>
    </Div>
  </Tabbar>
);

export default PetitionTabbar;

import React from "react";
import { Tabbar, Div, Button, FixedLayout } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./EditPetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";

const api = new VKMiniAppAPI();

const EditPetitionTabbar = () => {
  return (
    <FixedLayout vertical="bottom" className="Tabbar EditPetitionTabbar">
      <Div>
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            api.notificationOccurred("success");
          }}
        >
          Запустить
        </Button>
      </Div>
    </FixedLayout>
  );
};

EditPetitionTabbar.propTypes = {
};

export default EditPetitionTabbar;

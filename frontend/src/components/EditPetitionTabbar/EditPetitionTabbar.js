import React from "react";
import { Tabbar, Div, Button, FixedLayout } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./EditPetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";

const api = new VKMiniAppAPI();

const EditPetitionTabbar = ({ form }) => {
  // console.log(form.title);
  // const { title, text, signatures, file_1, file_2 } = form;
  // console.log(form.title, title, form.text, text, form.title && form.text);
  return (
    <FixedLayout vertical="bottom" className="Tabbar EditPetitionTabbar">
      <Div>
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            api.notificationOccurred("success");
          }}
          disabled={
            !(
              form.title &&
              form.text &&
              form.signatures &&
              form.file_1 &&
              form.file_2
            )
          }
        >
          Запустить
        </Button>
      </Div>
    </FixedLayout>
  );
};

EditPetitionTabbar.propTypes = {
  form: PropTypes.object.isRequired
};

export default EditPetitionTabbar;

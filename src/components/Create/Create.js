import React from "react";
import { Panel, PanelHeaderButton, PanelHeaderSimple } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

const api = new VKMiniAppAPI();

const Create = ({ id, activeStory, setStory, activePanel, setPage }) => {
  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple
        left={
          <PanelHeaderButton
            onClick={() => {
              api.setLocationHash(``).then(() => {
                setPage(activePanel, "feed");
              });
            }}
          >
            <Icon28ChevronBack />
          </PanelHeaderButton>
        }
      >
        Создание
      </PanelHeaderSimple>
      фвф
    </Panel>
  );
};

Create.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default Create;

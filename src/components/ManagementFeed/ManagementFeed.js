import React from "react";
import "./ManagementFeed.css";
import { Panel, PanelHeaderSimple, Button, Placeholder } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import EpicTabbar from "../EpicTabbar/EpicTabbar";

const api = new VKMiniAppAPI();

const ManagementFeed = ({
  id,
  activeStory,
  setStory,
  activePanel,
  setPage
}) => {
  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple>Петиции</PanelHeaderSimple>
      <Placeholder
        action={
          <Button
            size="l"
            onClick={() => {
              api.setLocationHash("create").then(() => {
                setPage(activePanel, "create");
              });
            }}
          >
            Создать петицию
          </Button>
        }
        stretched
      >
        Создавайте петиции, чтобы решать реальные проблемы
      </Placeholder>
      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

ManagementFeed.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default ManagementFeed;

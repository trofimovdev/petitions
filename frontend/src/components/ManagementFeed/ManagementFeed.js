import React, { useEffect } from "react";
import "./ManagementFeed.css";
import {
  Panel,
  PanelHeaderSimple,
  Button,
  Placeholder,
  usePlatform,
  getClassName
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import EpicTabbar from "../EpicTabbar/EpicTabbar";

const api = new VKMiniAppAPI();

const ManagementFeed = ({
  id,
  activeStory,
  setStory,
  activeView,
  activePanel,
  setPage
}) => {
  useEffect(() => {
    console.log("activePanel from management", activePanel);
    if (activePanel === "feed") {
      api.setLocationHash("management");
    }
  }, [activePanel]);

  const platform = usePlatform();
  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple separator>Петиции</PanelHeaderSimple>
      <Placeholder
        className={getClassName("Placeholder", platform)}
        action={
          <Button
            size="l"
            onClick={() => {
              setPage(activeView, "create");
              api.selectionChanged().catch(() => {});
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
  activeView: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default ManagementFeed;

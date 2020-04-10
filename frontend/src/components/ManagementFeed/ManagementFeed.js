import React, { useEffect, useState } from "react";
import "./ManagementFeed.css";
import {
  Panel,
  PanelHeaderSimple,
  Button,
  Placeholder,
  usePlatform,
  getClassName,
  Separator,
  Footer,
  PullToRefresh
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import PetitionCard from "../PetitionCard/PetitionCard";

const api = new VKMiniAppAPI();

const ManagementFeed = ({
  id,
  activeStory,
  setStory,
  activeView,
  activePanel,
  setPage,
  openModal,
  closeModal,
  petitions
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);

  const onRefresh = () => {
    console.log("refresh");
    setFetchingStatus(true);
    setTimeout(function() {
      setFetchingStatus(false);
    }, 1000);
  };

  useEffect(() => {
    console.log("activePanel from management", activePanel);
    if (activePanel === "feed") {      {/* <Placeholder */}
      {/*  className={getClassName("Placeholder", platform)} */}
      {/*  action={ */}
      {/*    <Button */}
      {/*      size="l" */}
      {/*      onClick={() => { */}
      {/*        setPage(activeView, "create"); */}
      {/*        api.selectionChanged().catch(() => {}); */}
      {/*      }} */}
      {/*    > */}
      {/*      Создать петицию */}
      {/*    </Button> */}
      {/*  } */}
      {/*  stretched */}
      {/* > */}
      {/*  Создавайте петиции, чтобы решать реальные проблемы */}
      {/* </Placeholder> */}

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

      <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
        <div className="ManagementFeed">lol</div>

        {petitions.popular.length > 0 && (
          <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
        )}
        {petitions.popular.length === 0 && (
          <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
        )}
      </PullToRefresh>

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
  setPage: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired
};

export default ManagementFeed;

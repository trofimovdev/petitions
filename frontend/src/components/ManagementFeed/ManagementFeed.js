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
  PullToRefresh,
  Spinner,
  ActionSheet,
  ActionSheetItem,
  IOS,
  Div
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon28EditOutline from "@vkontakte/icons/dist/28/edit_outline";
import Icon28BlockOutline from "@vkontakte/icons/dist/28/block_outline";
import Icon28DeleteOutline from "@vkontakte/icons/dist/28/delete_outline";
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
  petitions,
  setCurrent,
  setPopout
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const platform = usePlatform();

  const onManagement = () => {
    setPopout(
      <ActionSheet onClose={() => setPopout()}>
        <ActionSheetItem autoclose before={<Icon28EditOutline />}>
          Редактировать петицию
        </ActionSheetItem>
        <ActionSheetItem
          autoclose
          before={<Icon28BlockOutline />}
          mode="destructive"
        >
          Завершить сбор
        </ActionSheetItem>
        <ActionSheetItem
          autoclose
          before={<Icon28DeleteOutline />}
          mode="destructive"
        >
          Удалить петицию
        </ActionSheetItem>
        {platform === IOS && (
          <ActionSheetItem autoclose mode="cancel">
            Отменить
          </ActionSheetItem>
        )}
      </ActionSheet>
    );
  };

  const onRefresh = () => {
    console.log("refresh");
    setFetchingStatus(true);
    setTimeout(function() {
      setFetchingStatus(false);
    }, 1000);
  };

  useEffect(() => {
    console.log("activePanel from management", activePanel);
    if (activePanel === "feed") {
      api.setLocationHash("management");
    }
  }, [activePanel]);
  console.log(petitions.managed);
  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple separator>
        <div>
          Петиции
          <Div className="HeaderButton__wrapper FixedLayout">
            <Button size="xl" mode="secondary">
              Запустить
            </Button>
          </Div>
        </div>
      </PanelHeaderSimple>

      {petitions.managed !== undefined ? (
        petitions.managed.length === 0 ? (
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
        ) : (
          <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
            <div className="ManagementFeed">
              {petitions.managed.map((item, index) => {
                return (
                  <div key={index}>
                    <PetitionCard
                      id={item.id}
                      title={item.title}
                      numberOfSignatures={item.count_signatures}
                      totalSignatures={item.need_signatures}
                      mobilePhotoUrl={item.mobile_photo_url}
                      activeView={activeView}
                      setPage={setPage}
                      managementDots
                      setCurrent={setCurrent}
                      onManagement={onManagement}
                    />
                    {index < petitions.last.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>

            {petitions.managed.length > 0 && (
              <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
            )}
            {petitions.managed.length === 0 && (
              <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
            )}
          </PullToRefresh>
        )
      ) : (
        <Spinner size="regular" className="ManagementFeed__spinner" />
      )}

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
  petitions: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setPopout: PropTypes.func.isRequired
};

export default ManagementFeed;

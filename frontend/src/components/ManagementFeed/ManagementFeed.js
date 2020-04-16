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
import Icon24Add from '@vkontakte/icons/dist/24/add';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import PetitionCard from "../PetitionCard/PetitionCard";
import {
  setStory,
  setPage,
  openModal,
  closeModal
} from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import FriendsCard from "../FriendsCard/FriendsCard";

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
  managedPetitions,
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
  return (
    <Panel id={id} separator={false} className="ManagementFeed">
      <PanelHeaderSimple separator>
        <div>
          Петиции
          <Div className="HeaderButton__wrapper FixedLayout">
            <Button size="xl" mode="secondary" before={<Icon24Add />}>
              Создать петицию
            </Button>
          </Div>
        </div>
      </PanelHeaderSimple>

      {managedPetitions !== undefined ? (
        managedPetitions.length === 0 ? (
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
            <FriendsCard />
            {managedPetitions.map((item, index) => {
              return (
                <div key={index}>
                  <PetitionCard
                    id={item.id}
                    title={item.title}
                    countSignatures={item.count_signatures}
                    needSignatures={item.need_signatures}
                    mobilePhotoUrl={item.mobile_photo_url}
                    managementDots
                    onManagement={onManagement}
                  />
                  {index < managedPetitions.length - 1 && <Separator />}
                </div>
              );
            })}

            {managedPetitions.length > 0 && (
              <Footer className="FeedFooter">На этом все ¯\_(ツ)_/¯</Footer>
            )}
            {managedPetitions.length === 0 && (
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

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory,
    activeView: state.router.activeView,
    activePanel: state.router.activePanel,
    managedPetitions: state.petitions.managed
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setStory,
        setPage,
        setCurrent,
        openModal,
        closeModal
      },
      dispatch
    )
  };
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
  managedPetitions: PropTypes.array.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setPopout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagementFeed);

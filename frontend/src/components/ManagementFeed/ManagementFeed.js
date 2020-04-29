import React, { useEffect, useState } from "react";
import "./ManagementFeed.css";
import {
  Panel,
  PanelHeader,
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
  Div,
  Alert,
  Snackbar,
  Avatar,
  ScreenSpinner
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon28EditOutline from "@vkontakte/icons/dist/28/edit_outline";
import Icon28BlockOutline from "@vkontakte/icons/dist/28/block_outline";
import Icon28DeleteOutline from "@vkontakte/icons/dist/28/delete_outline";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import Icon28ChevronRightCircleOutline from "@vkontakte/icons/dist/28/chevron_right_circle_outline";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import PetitionCard from "../PetitionCard/PetitionCard";
import {
  setStory,
  setPage,
  openModal,
  closeModal,
  openPopout,
  closePopout
} from "../../store/router/actions";
import {
  setCurrent,
  setManaged,
  setFormType,
  setEdit,
  setInitialEdit
} from "../../store/petitions/actions";
import FriendsCard from "../FriendsCard/FriendsCard";
import { loadPetitions } from "../../tools/helpers";
import Backend from "../../tools/Backend";

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
  setPopout,
  launchParameters,
  setManaged,
  openPopout,
  closePopout,
  setFormType,
  setEdit,
  setInitialEdit
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const platform = usePlatform();

  const onManagement = (petitionId, completed) => {
    console.log("manage petition", petitionId, completed);
    openPopout(
      <ActionSheet onClose={() => closePopout()}>
        <ActionSheetItem
          autoclose
          before={<Icon28EditOutline />}
          onClick={() => {
            api.selectionChanged().catch(() => {});
            openPopout(<ScreenSpinner />);
            loadPetitions(`petitions/${petitionId.toString()}`, false)
              .then(response => {
                // TODO: remove eslint problems
                response = response[0];
                console.log("SET EDIT", response);

                const file_1 = new Image();
                file_1.crossOrigin = "Anonymous";
                file_1.onload = () => {
                  const canvas1 = document.createElement("canvas");
                  const ctx1 = canvas1.getContext("2d");
                  canvas1.height = file_1.height;
                  canvas1.width = file_1.width;
                  ctx1.drawImage(file_1, 0, 0);
                  const dataURL_file_1 = canvas1.toDataURL("image/png");
                  const file_2 = new Image();
                  file_2.crossOrigin = "Anonymous";
                  file_2.onload = () => {
                    const canvas2 = document.createElement("canvas");
                    const ctx2 = canvas2.getContext("2d");
                    canvas2.height = file_2.height;
                    canvas2.width = file_2.width;
                    ctx2.drawImage(file_2, 0, 0);
                    const dataURL_file_2 = canvas2.toDataURL("image/png");
                    const editForm = {
                      id: response.id,
                      title: response.title,
                      text: response.text,
                      signatures: response.count_signatures,
                      directed_to: response.directed_to,
                      file_1: dataURL_file_1,
                      file_2: dataURL_file_2
                    };
                    closePopout();
                    setInitialEdit(editForm);
                    setEdit(editForm);
                    setFormType("edit");
                    setPage(activeView, "edit");
                  };
                  file_2.src = `${response.web_photo_url}?12`;
                };
                file_1.src = `${response.mobile_photo_url}?12`;
              })
              .catch(e => console.log(e));
          }}
        >
          Редактировать петицию
        </ActionSheetItem>
        {completed ? (
          <ActionSheetItem
            autoclose
            before={<Icon28ChevronRightCircleOutline />}
            onClick={() => {
              Backend.request(
                `petitions/${petitionId}`,
                { completed: false },
                "PATCH"
              )
                .then(response => {
                  console.log(response);
                })
                .catch(error => {
                  console.log(error);
                });
            }}
          >
            Продолжить сбор
          </ActionSheetItem>
        ) : (
          <ActionSheetItem
            autoclose
            before={<Icon28BlockOutline />}
            mode="destructive"
            onClick={() => {
              Backend.request(
                `petitions/${petitionId}`,
                { completed: true },
                "PATCH"
              )
                .then(response => {
                  console.log(response);
                })
                .catch(error => {
                  console.log(error);
                });
            }}
          >
            Завершить сбор
          </ActionSheetItem>
        )}
        <ActionSheetItem
          autoclose
          before={<Icon28DeleteOutline />}
          mode="destructive"
          onClick={() => {
            openPopout(
              <Alert
                actionsLayout="vertical"
                onClose={() => closePopout()}
                actions={[
                  {
                    title: "Удалить",
                    autoclose: true,
                    mode: "destructive",
                    action: () => {
                      console.log("DELETE PETITION", petitionId);
                      console.log("PETITIONs", managedPetitions);
                      openPopout(<ScreenSpinner />);
                      Backend.request(`petitions/${petitionId}`, {}, "DELETE")
                        .then(r => {
                          console.log(r);
                          closePopout();
                          setManaged(
                            managedPetitions.filter(item => {
                              return item.id !== petitionId;
                            })
                          );
                          setSnackbar(
                            <Snackbar
                              layout="vertical"
                              onClose={() => setSnackbar()}
                              before={
                                <Avatar
                                  size={24}
                                  style={{
                                    backgroundColor: "var(--dynamic_green)"
                                  }}
                                >
                                  <Icon24DoneOutline
                                    fill="#fff"
                                    width={14}
                                    height={14}
                                  />
                                </Avatar>
                              }
                            >
                              Петиция удалена
                            </Snackbar>
                          );
                        })
                        .catch(e => {
                          console.log(e);
                        });
                    }
                  },
                  {
                    title: "Отмена",
                    autoclose: true,
                    mode: "cancel"
                  }
                ]}
              >
                <h2>Подтвердите действие</h2>
                <p>
                  Вы действительно хотите удалить петицию? Это действие нельзя
                  будет отменить.
                </p>
              </Alert>
            );
          }}
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
    setFetchingStatus(true);
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      console.log("with friends");
      loadPetitions("petitions", true, { type: "managed" })
        .then(response => {
          setFetchingStatus(false);
          setManaged(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(e => console.log(e));
    } else {
      loadPetitions("petitions", false, { type: "managed" })
        .then(response => {
          setFetchingStatus(false);
          setManaged(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(e => console.log(e));
    }
  };

  useEffect(() => {
    if (activePanel === "feed") {
      api.setLocationHash("management");
    }
  }, [activePanel]);
  return (
    <Panel
      id={id}
      separator={false}
      className={`${managedPetitions !== undefined ? "ManagementFeed" : ""}`}
    >
      <PanelHeader separator>
        <div>
          Петиции
          {managedPetitions !== undefined && managedPetitions.length > 0 && (
            <Div className="HeaderButton__wrapper FixedLayout">
              <Button
                size="xl"
                mode="secondary"
                before={<Icon24Add />}
                onClick={() => {
                  setFormType("create");
                  setPage(activeView, "edit");
                  api.selectionChanged().catch(() => {});
                }}
              >
                Создать петицию
              </Button>
            </Div>
          )}
        </div>
      </PanelHeader>

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
                    friends={item.friends || []}
                    completed={item.completed}
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
      {snackbar}
      <EpicTabbar activeStory={activeStory} setStory={setStory} />
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory,
    activeView: state.router.activeView,
    activePanel: state.router.activePanel,
    managedPetitions: state.petitions.managed,
    launchParameters: state.data.launchParameters
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
        closeModal,
        setManaged,
        openPopout,
        closePopout,
        setFormType,
        setEdit,
        setInitialEdit
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
  managedPetitions: PropTypes.array,
  setCurrent: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setManaged: PropTypes.func.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setInitialEdit: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagementFeed);

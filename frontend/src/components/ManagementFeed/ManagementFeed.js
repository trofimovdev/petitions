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
  ScreenSpinner,
  FixedLayout
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon28EditOutline from "@vkontakte/icons/dist/28/edit_outline";
import Icon28BlockOutline from "@vkontakte/icons/dist/28/block_outline";
import Icon28DeleteOutline from "@vkontakte/icons/dist/28/delete_outline";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import Icon28ChevronRightCircleOutline from "@vkontakte/icons/dist/28/chevron_right_circle_outline";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EpicTabbar from "../EpicTabbar/EpicTabbar";
import PetitionCard from "../PetitionCard/PetitionCard";
import { setPage, openPopout, closePopout } from "../../store/router/actions";
import {
  setCurrent,
  setManaged,
  setFormType,
  setEdit,
  setInitialEdit
} from "../../store/petitions/actions";
import FriendsCard from "../FriendsCard/FriendsCard";
import { loadPetitions, loadPhoto } from "../../tools/helpers";
import Backend from "../../tools/Backend";

const api = new VKMiniAppAPI();

const ManagementFeed = ({
  id,
  activeView,
  activePanel,
  setPage,
  managedPetitions,
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
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [endStatus, setEndStatus] = useState(false);
  const platform = usePlatform();

  const openEditForm = (
    file1_preview,
    file1,
    file2_preview,
    file2,
    response
  ) => {
    const editForm = {
      id: response.id,
      title: response.title,
      text: response.text,
      need_signatures: response.need_signatures,
      directed_to: response.directed_to,
      file1_preview,
      file1,
      file2_preview,
      file2
    };
    closePopout();
    setInitialEdit(editForm);
    setEdit(editForm);
    setFormType("edit");
    setPage(activeView, "edit");
  };

  const onManagement = (petitionId, completed) => {
    openPopout(
      <ActionSheet onClose={() => closePopout()}>
        {!completed && (
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
                  loadPhoto(response.mobile_photo_url)
                    .then(data1 => {
                      loadPhoto(response.web_photo_url)
                        .then(data2 => {
                          openEditForm(
                            data1[1],
                            data1[0],
                            data2[1],
                            data2[0],
                            response
                          );
                        })
                        .catch(() => {
                          openEditForm(
                            data1[1],
                            data1[0],
                            undefined,
                            undefined,
                            response
                          );
                        });
                    })
                    .catch(() => {
                      loadPhoto(response.web_photo_url)
                        .then(data2 => {
                          openEditForm(
                            undefined,
                            undefined,
                            data2[1],
                            data2[0],
                            response
                          );
                        })
                        .catch(() => {
                          openEditForm(
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            response
                          );
                        });
                    });
                })
                .catch(() => {});
            }}
          >
            Редактировать петицию
          </ActionSheetItem>
        )}
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
                  setManaged(
                    managedPetitions.map((item, index) => {
                      if (item.id === petitionId) {
                        item.completed = false;
                        return item;
                      }
                      return item;
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
                      Сбор продолжается
                    </Snackbar>
                  );
                })
                .catch(() => {
                  setSnackbar(
                    <Snackbar
                      layout="vertical"
                      onClose={() => setSnackbar()}
                      before={
                        <Avatar
                          size={24}
                          style={{
                            backgroundColor: "var(--destructive)"
                          }}
                        >
                          <Icon24Cancel fill="#fff" width={14} height={14} />
                        </Avatar>
                      }
                    >
                      Что-то пошло не так
                    </Snackbar>
                  );
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
                  setManaged(
                    managedPetitions.map((item, index) => {
                      if (item.id === petitionId) {
                        item.completed = true;
                        return item;
                      }
                      return item;
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
                      Сбор завершен
                    </Snackbar>
                  );
                })
                .catch(() => {
                  setSnackbar(
                    <Snackbar
                      layout="vertical"
                      onClose={() => setSnackbar()}
                      before={
                        <Avatar
                          size={24}
                          style={{
                            backgroundColor: "var(--destructive)"
                          }}
                        >
                          <Icon24Cancel fill="#fff" width={14} height={14} />
                        </Avatar>
                      }
                    >
                      Что-то пошло не так
                    </Snackbar>
                  );
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
                      openPopout(<ScreenSpinner />);
                      Backend.request(`petitions/${petitionId}`, {}, "DELETE")
                        .then(r => {
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
                        .catch(({ message }) => {
                          closePopout();
                          setSnackbar(
                            <Snackbar
                              layout="vertical"
                              onClose={() => setSnackbar()}
                              before={
                                <Avatar
                                  size={24}
                                  style={{
                                    backgroundColor: "var(--destructive)"
                                  }}
                                >
                                  <Icon24Cancel
                                    fill="#fff"
                                    width={14}
                                    height={14}
                                  />
                                </Avatar>
                              }
                            >
                              Петиция не удалена
                            </Snackbar>
                          );
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
      loadPetitions("petitions", true, { type: "managed" })
        .then(response => {
          setFetchingStatus(false);
          setManaged(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    } else {
      loadPetitions("petitions", false, { type: "managed" })
        .then(response => {
          setFetchingStatus(false);
          setManaged(response);
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    }
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    const petitionsContainer = document.getElementById(
      "managedPetitionsContainer"
    );

    if (!petitionsContainer) {
      return;
    }
    const petitionsContainerHeight =
      managedPetitions.length > 0 ? petitionsContainer.offsetHeight : 0;

    if (
      managedPetitions &&
      managedPetitions.length > 10 &&
      scrollPosition + 1300 > petitionsContainerHeight &&
      !loadingStatus &&
      !endStatus
    ) {
      // загружать новые карточки когда юзер пролистнет 5 карточку
      setLoadingStatus(true);
      if (launchParameters.vk_access_token_settings.includes("friends")) {
        loadPetitions("petitions", true, {
          offset: managedPetitions.length,
          type: "managed"
        })
          .then(r => {
            if (r.length === 0) {
              setEndStatus(true);
              return;
            }
            const petitions = managedPetitions
              .concat(r)
              .filter((value, index, self) => {
                return self.indexOf(value) === index;
              });
            setManaged(petitions);
            setLoadingStatus(false);
          })
          .catch(() => {});
      } else {
        loadPetitions("petitions", false, {
          offset: managedPetitions.length,
          type: "managed"
        })
          .then(r => {
            if (r.length === 0) {
              setEndStatus(true);
              return;
            }
            const petitions = managedPetitions
              .concat(r)
              .filter((value, index, self) => {
                return self.indexOf(value) === index;
              });
            setManaged(petitions);
            setLoadingStatus(false);
          })
          .catch(() => {});
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  useEffect(() => {
    if (activePanel === "feed") {
      api.setLocationHash("managed");
    }
    return () => {};
  }, [activePanel]);

  return (
    <Panel
      id={id}
      separator={false}
      className={`${
        managedPetitions !== undefined && managedPetitions.length > 0
          ? "ManagementFeed"
          : ""
      }`}
    >
      <PanelHeader separator>
        <div>
          Петиции
          {managedPetitions !== undefined && managedPetitions.length > 0 && (
            <FixedLayout
              className={`${getClassName("HeaderButton__wrapper", platform)}`}
            >
              <Div>
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
            </FixedLayout>
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
                  setFormType("create");
                  setPage(activeView, "edit");
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
          <PullToRefresh
            onRefresh={onRefresh}
            isFetching={fetchingStatus}
            id="managedPetitionsContainer"
          >
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
            {managedPetitions.length === 0 ? (
              <Footer>Тут ничего нет ¯\_(ツ)_/¯</Footer>
            ) : (managedPetitions.length > 0 && endStatus) ||
              (managedPetitions.length > 0 &&
                managedPetitions.length < 10 &&
                !endStatus) ? (
              <></>
            ) : (
              <Spinner
                size="regular"
                className="ManagementFeed__spinner__bottom"
              />
            )}
          </PullToRefresh>
        )
      ) : (
        <Spinner size="regular" className="ManagementFeed__spinner" />
      )}
      {snackbar}
      <EpicTabbar />
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
        setPage,
        setCurrent,
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
  activeView: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  managedPetitions: PropTypes.array,
  launchParameters: PropTypes.object.isRequired,
  setManaged: PropTypes.func.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setInitialEdit: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagementFeed);

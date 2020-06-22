import React, { useState } from "react";
import {
  Div,
  Button,
  FixedLayout,
  Spinner,
  getClassName,
  usePlatform,
  ScreenSpinner
} from "@vkontakte/vkui";
import Icon28ShareOutline from "@vkontakte/icons/dist/28/share_outline";
import Icon28SettingsOutline from "@vkontakte/icons/dist/28/settings_outline";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  openModal,
  setPage,
  openPopout,
  closePopout
} from "../../store/router/actions";
import {
  setCurrent,
  setSigned,
  setFormType,
  setEdit,
  setInitialEdit
} from "../../store/petitions/actions";
import Backend from "../../tools/Backend";
import { initPetitions, loadPetitions, loadPhoto } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const PetitionTabbar = ({
  openModal,
  currentPetition,
  launchParameters,
  setCurrent,
  activeView,
  setPage,
  setFormType,
  setEdit,
  setInitialEdit,
  openPopout,
  closePopout,
  setSnackbarError
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);

  const signPetition = () => {
    setFetchingStatus(true);
    Backend.request(`signatures/${currentPetition.id}`, {}, "PUT")
      .then(r => {
        if (r || r === 0) {
          setCurrent({
            ...currentPetition,
            ...{ signed: true, count_signatures: parseInt(r) }
          });
          initPetitions(launchParameters);
          api.notificationOccurred("success").catch(() => {});
          setFetchingStatus(false);
        }
      })
      .catch(({ code, message }) => {
        if (code === 409 || code === 404) {
          if (launchParameters.vk_access_token_settings.includes("friends")) {
            loadPetitions(`petitions`, true, {
              petition_id: currentPetition.id.toString()
            })
              .then(response => {
                if (response.length > 0) {
                  setCurrent(response[0]);
                }
              })
              .catch(() => {});
          } else {
            loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
              .then(response => {
                if (response.length > 0) {
                  setCurrent(response[0]);
                }
              })
              .catch(() => {});
          }
        } else {
          setSnackbarError(message);
        }
        api.selectionChanged().catch(() => {});
        setFetchingStatus(false);
      });
  };

  const unsignPetition = () => {
    setFetchingStatus(true);
    Backend.request(`signatures/${currentPetition.id}`, {}, "DELETE")
      .then(r => {
        if (r || r === 0) {
          setCurrent({
            ...currentPetition,
            ...{ signed: false, count_signatures: parseInt(r) }
          });
          initPetitions(launchParameters);
          api.selectionChanged().catch(() => {});
          setFetchingStatus(false);
        }
      })
      .catch(({ code, message }) => {
        if (code === 409 || code === 404) {
          if (launchParameters.vk_access_token_settings.includes("friends")) {
            loadPetitions(`petitions`, true, {
              petition_id: currentPetition.id.toString()
            })
              .then(response => {
                if (response.length > 0) {
                  setCurrent(response[0]);
                }
              })
              .catch(() => {});
          } else {
            loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
              .then(response => {
                if (response.length > 0) {
                  setCurrent(response[0]);
                }
              })
              .catch(() => {});
          }
        } else {
          setSnackbarError(message);
        }
        api.selectionChanged().catch(() => {});
        setFetchingStatus(false);
      });
  };

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

  const platform = usePlatform();

  return (
    <FixedLayout
      vertical="bottom"
      className={`PetitionTabbar Tabbar--shadow ${getClassName(
        "Tabbar",
        platform
      )} ${
        currentPetition.completed && currentPetition.signed
          ? "PetitionTabbar--signed"
          : ""
      }`}
    >
      {currentPetition.completed && currentPetition.signed && (
        <div className="PetitionTabbar__signed">
          <Icon24DoneOutline className="PetitionTabbar__signed__icon" />
          Вы подписали эту петицию
        </div>
      )}
      <Div className="PetitionTabbar__buttons">
        <Button
          className={`PetitionTabbar__buttons__sign ${
            currentPetition.completed
              ? "PetitionTabbar__buttons__sign--completed"
              : ""
          }`}
          size="xl"
          mode={
            currentPetition.signed || currentPetition.completed
              ? "secondary"
              : "primary"
          }
          onClick={() => {
            if (currentPetition.completed) {
              return;
            }
            if (currentPetition.signed) {
              unsignPetition();
            } else {
              signPetition();
            }
          }}
          disabled={fetchingStatus}
        >
          {!fetchingStatus ? (
            currentPetition.completed ? (
              "Сбор завершен"
            ) : currentPetition.signed ? (
              "Вы подписали"
            ) : (
              "Подписать"
            )
          ) : (
            <Spinner size="small" />
          )}
        </Button>
        <Button
          size="l"
          mode="secondary"
          onClick={() => {
            api.selectionChanged().catch(() => {});
            openModal("share-type");
          }}
        >
          <Icon28ShareOutline />
        </Button>
        {(currentPetition.owner_id === parseInt(launchParameters.vk_user_id) ||
          ["moder", "editor", "admin"].includes(
            launchParameters.vk_viewer_group_role
          )) && (
          <Button
            size="l"
            mode="secondary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              openPopout(<ScreenSpinner />);
              loadPetitions(
                `petitions/${currentPetition.id.toString()}`,
                false,
                { type: "edit" }
              )
                .then(response => {
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
            <Icon28SettingsOutline />
          </Button>
        )}
      </Div>
    </FixedLayout>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current,
    launchParameters: state.data.launchParameters,
    signedPetitions: state.petitions.signed,
    activeView: state.router.activeView,
    lastPetitions: state.petitions.last,
    popularPetitions: state.petitions.popular,
    managedPetitions: state.petitions.managed
  };
};

const mapDispatchToProps = {
  openModal,
  setCurrent,
  setSigned,
  setPage,
  setFormType,
  setEdit,
  setInitialEdit,
  openPopout,
  closePopout,
  initPetitions
};

PetitionTabbar.propTypes = {
  openModal: PropTypes.func.isRequired,
  currentPetition: PropTypes.object.isRequired,
  launchParameters: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  signedPetitions: PropTypes.array,
  activeView: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setInitialEdit: PropTypes.func.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setSnackbarError: PropTypes.func.isRequired,
  lastPetitions: PropTypes.array,
  popularPetitions: PropTypes.array,
  managedPetitions: PropTypes.array,
  initPetitions: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionTabbar);

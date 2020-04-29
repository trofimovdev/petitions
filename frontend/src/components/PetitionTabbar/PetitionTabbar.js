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
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
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
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const PetitionTabbar = ({
  openModal,
  currentPetition,
  launchParameters,
  setCurrent,
  setSigned,
  signedPetitions,
  activeView,
  setPage,
  setFormType,
  setEdit,
  setInitialEdit,
  openPopout,
  closePopout
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);

  const signPetition = () => {
    setFetchingStatus(true);
    Backend.request(`signatures/${currentPetition.id}`, {}, "PUT").then(r => {
      if (r) {
        setCurrent({ ...currentPetition, ...{ signed: true } });
        signedPetitions.unshift(currentPetition);
        setSigned(signedPetitions);
        setFetchingStatus(false);
        api.notificationOccurred("success").catch(() => {});
      }
    });
  };

  const unsignPetition = () => {
    setFetchingStatus(true);
    Backend.request(`signatures/${currentPetition.id}`, {}, "DELETE").then(
      r => {
        if (r) {
          setCurrent({ ...currentPetition, ...{ signed: false } });
          console.log(
            "SET SIGNED",
            signedPetitions.filter(item => {
              console.log(
                item,
                currentPetition,
                item.id !== currentPetition.id
              );
              return item.id !== currentPetition.id;
            })
          );
          setSigned(
            signedPetitions.filter(item => {
              return item.id !== currentPetition.id;
            })
          );
          setFetchingStatus(false);
          api.notificationOccurred("success").catch(() => {});
        }
      }
    );
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
            console.log("try to open");
            console.log("active MODALKA");
            openModal("share-type");
            console.log("opened");
          }}
        >
          <Icon24ShareOutline />
        </Button>
        {currentPetition.owner_id == launchParameters.vk_user_id && (
          <Button
            size="l"
            mode="secondary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              openPopout(<ScreenSpinner />);
              loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
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
            <Icon24Settings />
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
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        openModal,
        setCurrent,
        setSigned,
        setPage,
        setFormType,
        setEdit,
        setInitialEdit,
        openPopout,
        closePopout
      },
      dispatch
    )
  };
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
  closePopout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionTabbar);

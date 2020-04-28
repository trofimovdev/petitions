import React, { useState } from "react";
import {
  Div,
  Button,
  FixedLayout,
  Spinner,
  getClassName,
  usePlatform
} from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { openModal, setPage } from "../../store/router/actions";
import {
  setCurrent,
  setSigned,
  setFormType,
  setEdit
} from "../../store/petitions/actions";
import Backend from "../../tools/Backend";

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
  setEdit
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
          className={`PetitionTabbar__buttons__sign ${currentPetition.completed ? "PetitionTabbar__buttons__sign--completed" : ""}`}
          size="xl"
          mode={currentPetition.signed || currentPetition.completed ? "secondary" : "primary"}
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
              setFormType("edit");
              setEdit({
                title: currentPetition.title,
                text: currentPetition.text,
                signatures: currentPetition.need_signatures
              });
              setPage(activeView, "edit");
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
        setEdit
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
  setEdit: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionTabbar);

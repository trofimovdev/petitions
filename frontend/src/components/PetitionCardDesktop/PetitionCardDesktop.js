import React from "react";
import { Div, Card, UsersStack } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DropList, ModalDialog } from "@happysanta/vk-app-ui";
import Icon28ChevronDownOutline from "@vkontakte/icons/dist/28/chevron_down_outline";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import "./PetitionCardDesktop.css";
import {
  setCurrent,
  setEdit,
  setFormType,
  setInitialEdit,
  setLast,
  setManaged,
  setPopular,
  setSigned
} from "../../store/petitions/actions";
import { setPage } from "../../store/router/actions";
import { userStackText, loadPetitions, loadPhoto } from "../../tools/helpers";
import Backend from "../../tools/Backend";

const PetitionCardDesktop = ({
  id,
  title,
  countSignatures,
  needSignatures,
  webPhotoUrl,
  setPage,
  setCurrent,
  managementArrow,
  friends,
  completed,
  setManaged,
  setPopout,
  setFormType,
  setEdit,
  setInitialEdit,
  setPopular,
  setLast,
  setSigned,
  launchParameters
}) => {
  const deletePetition = (retry = false, message = "") => {
    if (retry) {
      setPopout(
        <ModalDialog
          header="Что-то пошло не так"
          confirmText="Повторить"
          cancelText="Отменить"
          className="PetitionCardDesktop__modal"
          loading
        >
          {{ message }}
        </ModalDialog>
      );
    } else {
      setPopout(
        <ModalDialog
          header="Подтвердите действие"
          confirmText="Удалить"
          cancelText="Отменить"
          className="PetitionCardDesktop__modal"
          loading
        >
          Вы действительно хотите удалить петицию?
          <br />
          Это действие нельзя будет отменить.
        </ModalDialog>
      );
    }

    Backend.request(`petitions/${id}`, {}, "DELETE")
      .then(r => {
        if (launchParameters.vk_access_token_settings.includes("friends")) {
          loadPetitions("petitions", true)
            .then(response => {
              setPopular(response.popular || []);
              setLast(response.last || []);
              setSigned(response.signed || []);
              setManaged(response.managed || []);
              setPopout();
            })
            .catch(() => {});
        } else {
          loadPetitions("petitions", false)
            .then(response => {
              setPopular(response.popular || []);
              setLast(response.last || []);
              setSigned(response.signed || []);
              setManaged(response.managed || []);
              setPopout();
            })
            .catch(() => {});
        }
      })
      .catch(({ errorMessage }) => {
        setPopout(
          <ModalDialog
            header="Что-то пошло не так"
            confirmText="Повторить"
            cancelText="Отменить"
            className="PetitionCardDesktop__modal"
            loading
            onClose={() => setPopout()}
            onConfirm={() => deletePetition(retry, errorMessage)}
          >
            {{ message }}
          </ModalDialog>
        );
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
    setInitialEdit(editForm);
    setEdit(editForm);
    setFormType("edit");
    setPage("edit", "", false, false, [], true);
  };

  const editAction = {
    body: "Редактировать",
    onClick: () => {
      loadPetitions(`petitions/${id.toString()}`, false, {
        type: "edit"
      })
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
    }
  };

  const startStopAction = {
    body: completed ? "Продолжить сбор" : "Завершить сбор",
    onClick: () => {
      if (completed) {
        Backend.request(`petitions/${id}`, { completed: false }, "PATCH")
          .then(() => {
            if (launchParameters.vk_access_token_settings.includes("friends")) {
              loadPetitions("petitions", true)
                .then(response => {
                  setPopular(response.popular || []);
                  setLast(response.last || []);
                  setSigned(response.signed || []);
                  setManaged(response.managed || []);
                })
                .catch(() => {});
            } else {
              loadPetitions("petitions", false)
                .then(response => {
                  setPopular(response.popular || []);
                  setLast(response.last || []);
                  setSigned(response.signed || []);
                  setManaged(response.managed || []);
                })
                .catch(() => {});
            }
          })
          .catch(() => {});
        return;
      }
      Backend.request(`petitions/${id}`, { completed: true }, "PATCH")
        .then(() => {
          if (launchParameters.vk_access_token_settings.includes("friends")) {
            loadPetitions("petitions", true)
              .then(response => {
                setPopular(response.popular || []);
                setLast(response.last || []);
                setSigned(response.signed || []);
                setManaged(response.managed || []);
              })
              .catch(() => {});
          } else {
            loadPetitions("petitions", false)
              .then(response => {
                setPopular(response.popular || []);
                setLast(response.last || []);
                setSigned(response.signed || []);
                setManaged(response.managed || []);
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
  };

  const deleteAction = {
    body: "Удалить петицию",
    onClick: () => {
      setPopout(
        <ModalDialog
          onClose={() => setPopout()}
          onConfirm={() => {
            deletePetition();
          }}
          header="Подтвердите действие"
          confirmText="Удалить"
          cancelText="Отменить"
          className="PetitionCardDesktop__modal"
        >
          Вы действительно хотите удалить петицию?
          <br />
          Это действие нельзя будет отменить.
        </ModalDialog>
      );
    }
  };

  return (
    <Div
      className="PetitionCardDesktop"
      onClick={e => {
        if (e.target.className.includes("DropList") || id === 0) {
          return;
        }
        setCurrent({ id });
        setPage("petition", "", false, false, [], true);
      }}
    >
      <div className="PetitionCardDesktop__info">
        <div className="PetitionCardDesktop__info__title-row">
          <h1 className="PetitionCardDesktop__info__title">{title}</h1>
          {managementArrow && (
            <DropList
              pin="left"
              items={
                completed
                  ? [startStopAction, deleteAction]
                  : [editAction, startStopAction, deleteAction]
              }
            >
              <Icon28ChevronDownOutline className="PetitionCardDesktop__info__arrow" />
            </DropList>
          )}
        </div>
        <PetitionProgress
          countSignatures={countSignatures}
          needSignatures={needSignatures}
          completed={completed}
        />
        {friends && friends.length > 0 && (
          <UsersStack
            className="PetitionCardDesktop__users-stack"
            photos={friends.slice(0, 3).map(item => {
              return item.user.photo_100;
            })}
          >
            {userStackText(friends)}
          </UsersStack>
        )}
      </div>
      <Card
        size="l"
        className="PetitionCardDesktop__card"
        style={{
          backgroundImage: `url(${webPhotoUrl})`
        }}
      />
    </Div>
  );
};

const mapStateToProps = state => {
  return {
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
        setFormType,
        setEdit,
        setInitialEdit,
        setPopular,
        setLast,
        setSigned
      },
      dispatch
    )
  };
};

PetitionCardDesktop.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  countSignatures: PropTypes.number.isRequired,
  needSignatures: PropTypes.number.isRequired,
  webPhotoUrl: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  managementArrow: PropTypes.bool,
  friends: PropTypes.array,
  completed: PropTypes.bool.isRequired,
  setManaged: PropTypes.func.isRequired,
  setPopout: PropTypes.func,
  setFormType: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setInitialEdit: PropTypes.func.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetitionCardDesktop);

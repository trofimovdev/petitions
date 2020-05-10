import React from "react";
import { Div, Card, UsersStack, ScreenSpinner } from "@vkontakte/vkui";
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
  setManaged
} from "../../store/petitions/actions";
import { setPage, openPopout, closePopout } from "../../store/router/actions";
import { declOfNum, loadPetitions, loadPhoto } from "../../tools/helpers";
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
  managedPetitions,
  setPopout,
  setFormType,
  setEdit,
  setInitialEdit,
  openPopout,
  closePopout
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
        setManaged(
          managedPetitions.filter(item => {
            return item.id !== id;
          })
        );
        setPopout();
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
    // closePopout();
    setInitialEdit(editForm);
    setEdit(editForm);
    setFormType("edit");
    setPage("edit", "");
  };

  return (
    <Div
      className="PetitionCardDesktop"
      onClick={e => {
        if (e.target.className.includes("DropList") || id === 0) {
          return;
        }
        setCurrent({ id });
        setPage("petition", "");
      }}
    >
      <div className="PetitionCardDesktop__info">
        <div className="PetitionCardDesktop__info__title-row">
          <h1 className="PetitionCardDesktop__info__title">{title}</h1>
          {managementArrow && (
            <DropList
              pin="left"
              items={[
                {
                  body: "Редактировать",
                  onClick: () => {
                    openPopout(<ScreenSpinner />);
                    loadPetitions(`petitions/${id.toString()}`, false)
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
                },
                {
                  body: completed ? "Продолжить сбор" : "Завершить сбор",
                  onClick: () => {
                    if (completed) {
                      Backend.request(
                        `petitions/${id}`,
                        { completed: false },
                        "PATCH"
                      )
                        .then(response => {
                          setManaged(
                            managedPetitions.map((item, index) => {
                              if (item.id === id) {
                                item.completed = false;
                                return item;
                              }
                              return item;
                            })
                          );
                        })
                        .catch(() => {});
                      return;
                    }
                    Backend.request(
                      `petitions/${id}`,
                      { completed: true },
                      "PATCH"
                    )
                      .then(response => {
                        setManaged(
                          managedPetitions.map((item, index) => {
                            if (item.id === id) {
                              item.completed = true;
                              return item;
                            }
                            return item;
                          })
                        );
                      })
                      .catch(() => {});
                  }
                },
                {
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
                }
              ]}
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
            className="Petition__users_stack"
            photos={friends.slice(0, 3).map(item => {
              return item.user.photo_50;
            })}
          >
            {friends.length === 1
              ? (friends[0].user.sex === "2" ? "Подписал " : "Подписала ") +
                friends[0].user.first_name
              : `Подписали ${
                  friends.length === 2
                    ? `${friends[0].user.first_name} и ${friends[1].user.first_name}`
                    : friends
                        .slice(0, 2)
                        .map(item => {
                          return item.user.first_name;
                        })
                        .join(", ")
                }${
                  friends.length > 3
                    ? `, ${friends[2].user.first_name} и еще ${friends.length -
                        3} ${declOfNum(friends.length - 3, [
                        "друг",
                        "друга",
                        "друзей"
                      ])}`
                    : `и ${friends[2].user.first_name}`
                }`}
            {}
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
    managedPetitions: state.petitions.managed
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
        openPopout,
        closePopout
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
  managedPetitions: PropTypes.array,
  setPopout: PropTypes.func,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setInitialEdit: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetitionCardDesktop);

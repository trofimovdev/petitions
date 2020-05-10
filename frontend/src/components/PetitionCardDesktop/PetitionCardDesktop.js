import React, { useState } from "react";
import { Div, Card, UsersStack, Snackbar, Avatar } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DropList, ModalDialog } from "@happysanta/vk-app-ui";
import Icon28ChevronDownOutline from "@vkontakte/icons/dist/28/chevron_down_outline";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import "./PetitionCardDesktop.css";
import { setCurrent, setManaged } from "../../store/petitions/actions";
import { setPage } from "../../store/router/actions";
import { declOfNum } from "../../tools/helpers";
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
  setPopout
}) => {
  const [deleting, setDeleting] = useState(null);

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

  return (
    <Div
      className="PetitionCardDesktop"
      onClick={e => {
        console.log(e.target.className);
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
                  onClick: () => {}
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
                          console.log(response, managedPetitions);
                          setManaged(
                            managedPetitions.map((item, index) => {
                              if (item.id === id) {
                                item.completed = false;
                                console.log(id, item);
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
                        console.log(response, managedPetitions);
                        setManaged(
                          managedPetitions.map((item, index) => {
                            if (item.id === id) {
                              item.completed = true;
                              console.log(id, item);
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
        setManaged
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
  setPopout: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetitionCardDesktop);

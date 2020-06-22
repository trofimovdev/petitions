import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Notify } from "@happysanta/vk-app-ui";
import {
  Avatar,
  Cell,
  Link,
  Placeholder,
  Separator,
  Spinner,
  UsersStack,
  Div
} from "@vkontakte/vkui";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import "./PetitionDesktop.css";
import Icon16Chevron from "@vkontakte/icons/dist/16/chevron";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24GearOutline from "@vkontakte/icons/dist/24/gear_outline";
import Linkify from "react-linkify";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import {
  userStackText,
  loadPetitions,
  loadPhoto,
  initPetitions
} from "../../tools/helpers";
import {
  setCurrent,
  setLast,
  setManaged,
  setPopular,
  setSigned,
  setInitialEdit,
  setEdit,
  setFormType
} from "../../store/petitions/actions";
import { setLaunchParameters } from "../../store/data/actions";
import { setPage } from "../../store/router/actions";
import Backend from "../../tools/Backend";

const api = new VKMiniAppAPI();

const PetitionDesktop = ({
  id,
  setCurrent,
  launchParameters,
  currentPetition,
  setPage,
  setSigned,
  setLast,
  setPopular,
  setManaged,
  setInitialEdit,
  setEdit,
  setFormType,
  appId,
  initPetitions
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [shareLoadingStatus, setShareLoadingStatus] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState(false);
  const [initError, setInitError] = useState(undefined);

  useEffect(() => {
    if (currentPetition.id) {
      api.setLocationHash(`p${currentPetition.id.toString()}`);
      if (loadingStatus) {
        if (launchParameters.vk_access_token_settings.includes("friends")) {
          loadPetitions(`petitions`, true, {
            petition_id: currentPetition.id.toString()
          })
            .then(response => {
              setLoadingStatus(false);
              if (response.length > 0) {
                setCurrent(response[0]);
              }
            })
            .catch(() => setInitError(true));
        } else {
          loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
            .then(response => {
              setLoadingStatus(false);
              if (response.length > 0) {
                setCurrent(response[0]);
              }
            })
            .catch(() => setInitError(true));
        }
      }
    }
    return () => {};
  }, [
    currentPetition.id,
    launchParameters.vk_access_token_settings,
    loadingStatus,
    setCurrent
  ]);

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
          setFetchingStatus(false);
        }
      })
      .catch(() => {
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
          setFetchingStatus(false);
        }
      })
      .catch(() => {
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
    setSettingsStatus(false);
    setInitialEdit(editForm);
    setEdit(editForm);
    setFormType("edit");
    setPage("edit", "", false, false, [], true);
  };

  const linkDecorator = (href, text, key) => (
    <Link
      href={href}
      key={key}
      target="_blank"
      className="PetitionDesktop__link"
      rel="noopener noreferrer"
    >
      {text}
    </Link>
  );

  return (
    <div id={id} className="PetitionDesktop">
      {initError ? (
        <Div>
          <Notify type="error">
            <strong>Что-то пошло не так...</strong>
            <br />
            Попробуйте еще раз через несколько минут
          </Notify>
        </Div>
      ) : Object.keys(currentPetition).length < 3 && !loadingStatus ? (
        <Placeholder
          action={
            <Button
              mode="primary"
              onClick={() => {
                setPage("petitions", "");
              }}
            >
              На главную
            </Button>
          }
          stretched
        >
          Петиция не найдена
        </Placeholder>
      ) : Object.keys(currentPetition).length > 2 ? (
        <>
          <div className="PetitionDesktop__image">
            <img src={`${currentPetition.web_photo_url}`} alt="header" />
            <div
              className="PetitionDesktop__back"
              onClick={() => {
                setPage("petitions", "");
              }}
            >
              <Icon16Chevron className="PetitionDesktop__back__icon" />
              Назад
            </div>
          </div>
          <div className="PetitionDesktop__wrapper">
            <h1>{currentPetition.title}</h1>
            <PetitionProgress
              countSignatures={currentPetition.count_signatures}
              needSignatures={currentPetition.need_signatures}
              signed={currentPetition.signed}
              completed={currentPetition.completed}
            />
            <div className="PetitionDesktop__info">
              <div className="PetitionDesktop__info__buttons">
                <Button
                  mode={
                    currentPetition.signed || currentPetition.completed
                      ? "secondary"
                      : "primary"
                  }
                  disabled={currentPetition.completed}
                  loading={fetchingStatus}
                  onClick={() => {
                    if (currentPetition.signed) {
                      unsignPetition();
                    } else {
                      signPetition();
                    }
                  }}
                >
                  {currentPetition.completed
                    ? "Сбор завершен"
                    : currentPetition.signed
                    ? "Вы подписали"
                    : "Подписать петицию"}
                </Button>
                <Button
                  mode="secondary"
                  loading={shareLoadingStatus}
                  className="PetitionDesktop__info__buttons__share"
                  onClick={() => {
                    setShareLoadingStatus(true);
                    api
                      .postToWall(
                        "",
                        `https://vk.com/app${appId}#p${currentPetition.id}`
                      )
                      .then(() => {
                        setShareLoadingStatus(false);
                      })
                      .catch(() => {
                        setShareLoadingStatus(false);
                      });
                  }}
                >
                  <Icon24ShareOutline className="PetitionDesktop__info__buttons__share__icon" />
                </Button>
                {(currentPetition.owner_id ===
                  parseInt(launchParameters.vk_user_id) ||
                  ["moder", "editor", "admin"].includes(
                    launchParameters.vk_viewer_group_role
                  )) && (
                  <Button
                    mode="secondary"
                    loading={settingsStatus}
                    className="PetitionDesktop__info__buttons__settings"
                    onClick={() => {
                      setSettingsStatus(true);
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
                    <Icon24GearOutline className="PetitionDesktop__info__buttons__settings__icon" />
                  </Button>
                )}
              </div>
              {currentPetition.friends && currentPetition.friends.length > 0 && (
                <UsersStack
                  className="PetitionDesktop__users-stack"
                  photos={currentPetition.friends.slice(0, 3).map(item => {
                    return item.user.photo_100;
                  })}
                >
                  {userStackText(currentPetition.friends)}
                </UsersStack>
              )}
            </div>
            <Separator />
            <Linkify componentDecorator={linkDecorator}>
              <p className="PetitionDesktop__text">{currentPetition.text}</p>
            </Linkify>
            <Separator />
            <Cell
              className="PetitionDesktop__creator"
              before={
                <a
                  className="Petition__creator__avatar"
                  href={
                    parseInt(currentPetition.owner_id) < 0
                      ? `https://vk.com/public${Math.abs(
                          currentPetition.owner_id
                        )}`
                      : `https://vk.com/id${currentPetition.owner_id}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Avatar src={currentPetition.owner.photo_100} size={40} />
                </a>
              }
              multiline
            >
              {parseInt(currentPetition.owner_id) < 0 && "Сообщество «"}
              <Link
                href={
                  parseInt(currentPetition.owner_id) < 0
                    ? `https://vk.com/public${Math.abs(
                        currentPetition.owner_id
                      )}`
                    : `https://vk.com/id${currentPetition.owner_id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="PetitionDesktop__creator__link"
              >
                {parseInt(currentPetition.owner_id) < 0
                  ? `${currentPetition.owner.name}`
                  : `${currentPetition.owner.first_name} ${currentPetition.owner.last_name}`}
              </Link>
              {parseInt(currentPetition.owner_id) < 0 && "» "}
              {`${
                parseInt(currentPetition.owner_id) < 0
                  ? "создало "
                  : parseInt(currentPetition.owner.sex) === 2
                  ? " создал "
                  : " создала "
              } петицию${
                currentPetition.directed_to.length > 0 ? `, адресованную ` : ""
              }`}
              {currentPetition.directed_to.length > 0 &&
                currentPetition.directed_to.map((item, index) => {
                  let ending = ", ";
                  if (index === currentPetition.directed_to.length - 1) {
                    ending = "";
                  }
                  if (index === currentPetition.directed_to.length - 2) {
                    ending = " и ";
                  }
                  if (typeof item === "string") {
                    return `${item}${ending}`;
                  }

                  return (
                    <React.Fragment key={index}>
                      <Link
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="Petition__link"
                      >
                        {item.name}
                      </Link>
                      <span>{ending}</span>
                    </React.Fragment>
                  );
                })}
            </Cell>
          </div>
        </>
      ) : (
        <Spinner size="regular" className="ManagementFeed__spinner" />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeTab: state.router.activeTab.feed,
    launchParameters: state.data.launchParameters,
    currentPetition: state.petitions.current,
    appId: state.data.appId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setCurrent,
        setLaunchParameters,
        setPage,
        setSigned,
        setLast,
        setPopular,
        setManaged,
        setInitialEdit,
        setEdit,
        setFormType,
        initPetitions
      },
      dispatch
    )
  };
};

PetitionDesktop.propTypes = {
  id: PropTypes.string.isRequired,
  setCurrent: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  currentPetition: PropTypes.object,
  setPage: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setPopular: PropTypes.func.isRequired,
  setManaged: PropTypes.func.isRequired,
  setInitialEdit: PropTypes.func.isRequired,
  setEdit: PropTypes.func.isRequired,
  setFormType: PropTypes.func.isRequired,
  appId: PropTypes.number.isRequired,
  initPetitions: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionDesktop);

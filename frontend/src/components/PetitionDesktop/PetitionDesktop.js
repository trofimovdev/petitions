import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "@happysanta/vk-app-ui";
import {
  Avatar,
  Cell,
  Footer,
  Link,
  Placeholder,
  PullToRefresh,
  ScreenSpinner,
  Separator,
  Spinner,
  UsersStack
} from "@vkontakte/vkui";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import "./PetitionDesktop.css";
import Icon16Chevron from "@vkontakte/icons/dist/16/chevron";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import { declOfNum, loadPetitions } from "../../tools/helpers";
import { setCurrent, setSigned } from "../../store/petitions/actions";
import { setLaunchParameters } from "../../store/data/actions";
import { setPage } from "../../store/router/actions";
import Backend from "../../tools/Backend";

const api = new VKMiniAppAPI();

const PetitionDesktop = ({
  id,
  setCurrent,
  launchParameters,
  currentPetition,
  setLaunchParameters,
  setPage,
  signedPetitions,
  setSigned
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [shareLoadingStatus, setShareLoadingStatus] = useState(false);

  useEffect(() => {
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
          .catch(() => {});
      } else {
        loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
          .then(response => {
            setLoadingStatus(false);
            if (response.length > 0) {
              setCurrent(response[0]);
            }
          })
          .catch(() => {});
      }
    }
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
          signedPetitions.unshift(currentPetition);
          setSigned(signedPetitions);
          setFetchingStatus(false);
        }
      })
      .catch(({ message }) => {
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
          setSigned(
            signedPetitions.filter(item => {
              return item.id !== currentPetition.id;
            })
          );
          setFetchingStatus(false);
        }
      })
      .catch(({ code, message }) => {
        setFetchingStatus(false);
      });
  };

  return (
    <div id={id} className="PetitionDesktop">
      {Object.keys(currentPetition).length === 1 && !loadingStatus ? (
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
          Кажется, эта петиция была удалена.
        </Placeholder>
      ) : Object.keys(currentPetition).length > 1 ? (
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
                      .getAccessToken(7338958, "photos")
                      .then(({ scope, accessToken }) => {
                        if (!scope.includes("photos")) {
                          return;
                        }
                        if (
                          !launchParameters.vk_access_token_settings.includes(
                            "photos"
                          )
                        ) {
                          setLaunchParameters({
                            ...launchParameters,
                            vk_access_token_settings: launchParameters.vk_access_token_settings
                              .split(",")
                              .concat("photos")
                              .join(",")
                          });
                        }
                        api
                          .callAPIMethod("photos.getWallUploadServer", {
                            v: "5.105",
                            access_token: accessToken
                          })
                          .then(({ upload_url }) => {
                            Backend.request(
                              "petitions",
                              {
                                petition_id: currentPetition.id,
                                type: "upload",
                                upload_url
                              },
                              "POST"
                            ).then(({ server, photo, hash }) => {
                              api
                                .callAPIMethod("photos.saveWallPhoto", {
                                  v: "5.105",
                                  access_token: accessToken,
                                  server,
                                  photo,
                                  hash
                                })
                                .then(response => {
                                  setShareLoadingStatus(false);
                                  const { id, owner_id } = response[0];
                                  api.postToWall(
                                    `Поддержите петицию «${currentPetition.title}»\n\nhttps://vk.com/app7338958#p${currentPetition.id}`,
                                    `photo${owner_id}_${id}`
                                  );
                                });
                            });
                          });
                      });
                  }}
                >
                  <Icon24ShareOutline className="PetitionDesktop__info__buttons__share__icon" />
                </Button>
              </div>
              {currentPetition.friends && currentPetition.friends.length > 0 && (
                <UsersStack
                  className="Petition__users_stack"
                  photos={currentPetition.friends.slice(0, 3).map(item => {
                    return item.user.photo_50;
                  })}
                >
                  {currentPetition.friends.length === 1
                    ? (currentPetition.friends[0].user.sex === "2"
                        ? "Подписал "
                        : "Подписала ") +
                      currentPetition.friends[0].user.first_name
                    : `Подписали ${
                        currentPetition.friends.length === 2
                          ? `${currentPetition.friends[0].user.first_name} и ${currentPetition.friends[1].user.first_name}`
                          : currentPetition.friends
                              .slice(0, 2)
                              .map(item => {
                                return item.user.first_name;
                              })
                              .join(", ")
                      }${
                        currentPetition.friends.length > 3
                          ? `, ${
                              currentPetition.friends[2].user.first_name
                            } и еще ${currentPetition.friends.length -
                              3} ${declOfNum(
                              currentPetition.friends.length - 3,
                              ["друг", "друга", "друзей"]
                            )}`
                          : `и ${currentPetition.friends[2].user.first_name}`
                      }`}
                  {}
                </UsersStack>
              )}
            </div>
            <Separator />
            <p className="PetitionDesktop__text">{currentPetition.text}</p>
            <Separator />
            <Cell
              className="PetitionDesktop__creator"
              before={
                <a
                  className="Petition__creator__avatar"
                  href={`https://vk.com/id${currentPetition.owner_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Avatar src={currentPetition.owner.photo_50} size={40} />
                </a>
              }
              multiline
            >
              <Link
                href={`https://vk.com/id${currentPetition.owner_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="Petition__creator__link"
              >
                {`${currentPetition.owner.first_name} ${currentPetition.owner.last_name}`}
              </Link>
              {`${
                currentPetition.owner.sex.toString() === "2"
                  ? "создал "
                  : "создала "
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
    signedPetitions: state.petitions.signed
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
        setSigned
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
  setLaunchParameters: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  signedPetitions: PropTypes.array,
  setSigned: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionDesktop);

import React, { useState } from "react";
import {
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Button,
  Div,
  List,
  Cell,
  Search,
  FixedLayout,
  Avatar,
  ANDROID,
  IOS,
  usePlatform,
  getClassName,
  Placeholder,
  Spinner,
  ScreenSpinner
} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import Icon28StoryOutline from "@vkontakte/icons/dist/28/story_outline";
import Icon28ArrowUturnRightOutline from "@vkontakte/icons/dist/28/arrow_uturn_right_outline";
import Icon28ChainOutline from "@vkontakte/icons/dist/28/chain_outline";
import "./PetitionModal.css";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
// TODO: move to vk-mini-apps-api
import bridge from "@vkontakte/vk-bridge";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  closeModal,
  openPopout,
  closePopout
} from "../../store/router/actions";
import { setLaunchParameters } from "../../store/data/actions";
import Backend from "../../tools/Backend";

const api = new VKMiniAppAPI();

const PetitionModal = ({
  currentPetition,
  closeModal,
  activeModal,
  launchParameters,
  setLaunchParameters,
  openPopout,
  closePopout
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [friendsList, setFriendsList] = useState(null);
  function fragmentText(text, maxWidth, ctx) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    if (ctx.measureText(text).width < maxWidth) {
      return [text];
    }
    while (words.length > 0) {
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const tmp = words[0];
        words[0] = tmp.slice(0, -1);
        if (words.length > 1) {
          words[1] = tmp.slice(-1) + words[1];
        } else {
          words.push(tmp.slice(-1));
        }
      }
      if (ctx.measureText(line + words[0]).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line);
        line = "";
      }
      if (words.length === 0) {
        lines.push(line);
      }
    }
    return lines;
  }

  if (
    launchParameters.vk_access_token_settings.includes("friends") &&
    !searchValue &&
    !friendsList
  ) {
    api.getAccessToken(7338958, "friends").then(r => {
      if (!r.scope.includes("friends")) {
        return;
      }
      api
        .callAPIMethod("friends.get", {
          fields: "photo_50,sex",
          access_token: r.accessToken,
          v: "5.103"
        })
        .then(response => {
          console.log(
            "response friends response friends response friends response friends response friends response friends response friends response friends response friends response friends",
            response
          );
          setFriendsList(response.items);
        });
    });
  }

  const searchUsers = e => {
    const request = e.target.value;
    setSearchValue();
    api.getAccessToken(7338958, "friends").then(r => {
      if (!r.scope.includes("friends")) {
        return;
      }
      api
        .callAPIMethod("users.search", {
          q: request,
          fields: "photo_50,sex",
          access_token: r.accessToken,
          v: "5.103"
        })
        .then(response => {
          console.log("response", response);
        });
    });
  };

  const getAccessToken = () => {
    api.getAccessToken(7338958, "friends").then(r => {
      if (!r.scope.includes("friends")) {
        return;
      }
      setLaunchParameters({
        ...launchParameters,
        vk_access_token_settings: launchParameters.vk_access_token_settings
          .split(",")
          .concat("friends")
          .join(",")
      });
    });
  };

  const platform = usePlatform();
  return (
    <ModalRoot activeModal={activeModal} onClose={closeModal}>
      <ModalPage
        id="share-type"
        onClose={closeModal}
        header={
          <ModalPageHeader
            left={
              platform === ANDROID && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              )
            }
            right={
              platform === IOS && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
          >
            Поделиться
          </ModalPageHeader>
        }
      >
        <Div className="PetitionModal">
          <div
            className="PetitionModal__button-wrapper"
            onClick={() => {
              openPopout(<ScreenSpinner />);
              // ctx.moveTo(0, 1800);

              const canvas = document.createElement("canvas");
              const r = window.devicePixelRatio;
              canvas.width = 248 * r;
              canvas.height = 318 * r;
              const ctx = canvas.getContext("2d");
              const borderRadius = 13 * r;
              const borderRadiusProgressBar = 2 * r;

              ctx.fillStyle = "#9ea7b8";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              ctx.fillStyle = "green";
              ctx.beginPath();
              ctx.moveTo(0, canvas.height);
              ctx.arcTo(0, 0, canvas.width, 0, borderRadius);
              ctx.arcTo(
                canvas.width,
                0,
                canvas.width,
                canvas.height,
                borderRadius
              );
              ctx.arcTo(
                canvas.width,
                canvas.height,
                0,
                canvas.height,
                borderRadius
              );
              ctx.arcTo(0, canvas.height, 0, 0, borderRadius);
              ctx.fill();

              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.onload = () => {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.min(hRatio, vRatio);
                const h = img.height - img.width / 1.875;
                console.log(h);
                ctx.drawImage(
                  img,
                  0,
                  0,
                  img.width,
                  img.height - h,
                  0,
                  0,
                  img.width * ratio,
                  (img.height - h) * ratio
                );
                ctx.font = `${18 * r}px serif`;
                ctx.fillStyle = "red";
                const text =
                  "Дискретность амбивалентно транспонирует гравитационный парадокс. Апостериори, гравитационный парадокс амбивалентно понимает под собой интеллигибельный";
                const lines = fragmentText(
                  text,
                  canvas.width - 16 * r - 32 * r,
                  ctx
                );
                console.log(lines);
                lines.forEach(function(line, i) {
                  console.log(line, i);
                  ctx.fillText(
                    line,
                    16 * r,
                    11 * r + (img.height - h) * ratio + (i + 1) * 18 * r
                  );
                });
                ctx.font = `${16 * r}px serif`;
                ctx.fillStyle = "blue";
                ctx.fillText(
                  "100 000 000 из 10 000 000 подписей",
                  16 * r,
                  120 * r
                );

                ctx.fillStyle = "blue";
                ctx.beginPath();
                ctx.moveTo(16 * r, canvas.height - 16 * r - 18 * r);

                ctx.arcTo(
                  16 * r,
                  canvas.height - 16 * r - 36 * r,
                  canvas.width - 16 * r,
                  canvas.height - 16 * r - 36 * r,
                  borderRadius
                );
                ctx.arcTo(
                  canvas.width - 16 * r,
                  canvas.height - 16 * r - 36 * r,
                  canvas.width - 16 * r,
                  canvas.height - 16 * r,
                  borderRadius
                );
                ctx.arcTo(
                  canvas.width - 16 * r,
                  canvas.height - 16 * r,
                  16 * r,
                  canvas.height - 16 * r,
                  borderRadius
                );
                ctx.arcTo(
                  16 * r,
                  canvas.height - 16 * r,
                  16 * r,
                  canvas.height - 16 * r - 36 * r,
                  borderRadius
                );
                ctx.fill();

                ctx.font = `${14 * r}px serif`;
                ctx.fillStyle = "white";
                const signText = "Подписать";
                const signTextSize = ctx.measureText(signText);
                ctx.fillText(
                  signText,
                  canvas.width -
                    16 * r -
                    (216 * r) / 2 -
                    signTextSize.width / 2,
                  canvas.height - 16 * r - 18 * r + (7 * r) / 2
                );

                ctx.fillStyle = "blue";
                ctx.beginPath();
                ctx.moveTo(
                  16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r - 2 * r
                );

                ctx.arcTo(
                  16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                  canvas.width - 16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                  borderRadiusProgressBar
                );
                ctx.arcTo(
                  canvas.width - 16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                  canvas.width - 16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r,
                  borderRadiusProgressBar
                );
                ctx.arcTo(
                  canvas.width - 16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r,
                  16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r,
                  borderRadiusProgressBar
                );
                ctx.arcTo(
                  16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r,
                  16 * r,
                  canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                  borderRadiusProgressBar
                );
                ctx.fill();

                bridge
                  .send("VKWebAppShowStoryBox", {
                    background_type: "none",
                    stickers: [
                      {
                        sticker_type: "renderable",
                        sticker: {
                          can_delete: false,
                          content_type: "image",
                          blob: canvas.toDataURL(),
                          transform: {
                            relation_width: 0.7
                          },
                          clickable_zones: [
                            {
                              action_type: "app",
                              action: {
                                app_id: 7338958,
                                app_context: "#p4"
                              },
                              clickable_area: [
                                {
                                  x: 0,
                                  y: 0
                                },
                                {
                                  x: 1000,
                                  y: 0
                                },
                                {
                                  x: 1000,
                                  y: 1000
                                },
                                {
                                  x: 0,
                                  y: 1000
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  })
                  .catch(e => console.log("error", e));
              };
              img.src =
                "https://petitions.trofimov.dev/static/pig_1440x768.png?01";
            }}
          >
            <Button
              mode="secondary"
              className="PetitionModal__button-wrapper__button"
            >
              <Icon28StoryOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">В истории</p>
          </div>

          <div
            className="PetitionModal__button-wrapper"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              console.log("CLICKED");
              console.log(platform);

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
                    console.log(launchParameters);
                  }
                  api
                    .callAPIMethod("photos.getWallUploadServer", {
                      v: "5.105",
                      access_token: accessToken
                    })
                    .then(({ upload_url }) => {
                      openPopout(<ScreenSpinner />);
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
                            const { id, owner_id } = response[0];
                            console.log(response[0]);
                            closePopout();
                            api.postToWall(
                              `Поддержите петицию «${currentPetition.title}»\n\nhttps://vk.com/app7338958#p${currentPetition.id}`,
                              `photo${owner_id}_${id}`
                            );
                          });
                      });
                    });
                });
              console.log("done");
            }}
          >
            <Button
              mode="secondary"
              className="PetitionModal__button-wrapper__button"
            >
              <Icon28ArrowUturnRightOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">
              На своей странице
            </p>
          </div>

          <div
            className="PetitionModal__button-wrapper"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              bridge.send("VKWebAppCopyText", {
                text: `https://vk.com/app7338958#p${currentPetition.id}`
              });
            }}
          >
            <Button
              mode="secondary"
              className="PetitionModal__button-wrapper__button"
            >
              <Icon28ChainOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">
              Скопировать ссылку
            </p>
          </div>
        </Div>
      </ModalPage>

      <ModalPage
        id="select-users"
        className="SelectUsers"
        dynamicContentHeight
        onClose={closeModal}
        header={
          <ModalPageHeader
            left={
              platform === ANDROID && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              )
            }
            right={
              platform === IOS && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
          >
            Выберите пользователей
          </ModalPageHeader>
        }
      >
        {launchParameters.vk_access_token_settings.includes("friends") ? (
          <>
            <FixedLayout vertical="top" className="SelectUsers__search">
              <Search onChange={searchUsers} />
            </FixedLayout>
            <List className="SelectUsers__list">
              {friendsList && false ? (
                friendsList.map((item, index) => {
                  return (
                    <Cell
                      selectable
                      before={
                        <Avatar
                          size={40}
                          src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
                        />
                      }
                    >
                      Выбранный Юзер 3
                    </Cell>
                  );
                })
              ) : (
                <Placeholder className="SelectUsers__spinner">
                  <Spinner size="regular" />
                </Placeholder>
              )}
            </List>
          </>
        ) : (
          <Placeholder
            className="SelectUsers__placeholder"
            action={
              <Button
                size="l"
                onClick={() => {
                  api.selectionChanged().catch(() => {});
                  getAccessToken();
                }}
              >
                Предоставить доступ
              </Button>
            }
          >
            Чтобы отмечать друзей и других людей в петиции, необходимо
            предоставить доступ к их списку
          </Placeholder>
        )}
      </ModalPage>
    </ModalRoot>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current,
    launchParameters: state.data.launchParameters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        closeModal,
        setLaunchParameters,
        openPopout,
        closePopout
      },
      dispatch
    )
  };
};

PetitionModal.propTypes = {
  currentPetition: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  launchParameters: PropTypes.object.isRequired,
  setLaunchParameters: PropTypes.func.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionModal);

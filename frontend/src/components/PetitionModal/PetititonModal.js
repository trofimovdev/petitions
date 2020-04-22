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
  Spinner
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
import { closeModal } from "../../store/router/actions";
import { setLaunchParameters } from "../../store/data/actions";

const api = new VKMiniAppAPI();

const PetitionModal = ({
  currentPetition,
  closeModal,
  activeModal,
  launchParameters,
  setLaunchParameters
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [friendsList, setFriendsList] = useState(null);

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
              // ctx.moveTo(0, 1800);

              const canvas = document.createElement("canvas");
              canvas.width = 1440;
              canvas.height = 1100;
              const borderRadius = (canvas.width / 268) * 16;

              const ctx = canvas.getContext("2d");
              ctx.fillStyle = "#9ea7b8";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => {
                console.log("background loaded");
                ctx.drawImage(img, 0, 0, img.width, img.height);
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
                          clickable_zones: [
                            {
                              action_type: "link",
                              action: {
                                link: "https://vk.com/wall-166562603_1192",
                                tooltip_text_key: "tooltip_open_post"
                              },
                              clickable_area: [
                                {
                                  x: 17,
                                  y: 110
                                },
                                {
                                  x: 97,
                                  y: 110
                                },
                                {
                                  x: 97,
                                  y: 132
                                },
                                {
                                  x: 17,
                                  y: 132
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
                "https://petitions.trofimov.dev/static/pig_1440x768.png?1asdasd1";
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
              console.log("CLICKED");
              console.log(platform);
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
              console.log("copy to clipboard petition id", currentPetition.id);
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
        setLaunchParameters
      },
      dispatch
    )
  };
};

PetitionModal.propTypes = {
  currentPetition: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  launchParameters: PropTypes.object.isRequired,
  setLaunchParameters: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionModal);

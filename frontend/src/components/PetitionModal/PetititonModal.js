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
  Placeholder
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

const api = new VKMiniAppAPI();

const PetitionModal = ({ currentPetition, closeModal, activeModal }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const searchUsers = e => {
    // console.log(e.currentTarget.value);
    api
      .callAPIMethod("users.search", {
        q: "durov",
        fields: "photo_50",
        access_token:
          "ecba06da02faea12cd315ad3ba07d548fd53ca64ebca481edc5f716496b0af9f2356cd7a7ef66bc9d1f50",
        v: "5.103"
      })
      .then(r => {
        console.log("response", r);
      });

    // TODO: вынести в константы
    // api.getAccessToken(7338958, "friends").then(r => {
    //   console.log(r);
    // });
  };

  const getAccessToken = e => {
    api.getAccessToken(7338958, "").then(r => {
      console.log(r);
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

              // const ctx = canvas.getContext("2d");
              // ctx.fillStyle = "green";
              // ctx.fillRect(0, 0, canvas.width, 5000);
              // console.log(canvas.toDataURL());
              //
              // // draw substrate
              // ctx.fillStyle = "red";
              // ctx.beginPath();
              // ctx.moveTo(0, canvas.height);
              // ctx.arcTo(0, 0, canvas.width, 0, borderRadius);
              // ctx.arcTo(
              //   canvas.width,
              //   0,
              //   canvas.width,
              //   canvas.height,
              //   borderRadius
              // );
              // ctx.arcTo(
              //   canvas.width,
              //   canvas.height,
              //   0,
              //   canvas.height,
              //   borderRadius
              // );
              // ctx.arcTo(0, canvas.height, 0, 0, borderRadius);
              // ctx.fill();
              // console.log(canvas.toDataURL());

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

              // ctx.fillStyle = "blue";
              // ctx.beginPath();
              // ctx.arcTo(0, 0, canvas.width, 0, borderRadius);
              // ctx.arcTo(
              //   canvas.width,
              //   0,
              //   canvas.width,
              //   canvas.height,
              //   borderRadius
              // );
              // ctx.arcTo(
              //   canvas.width,
              //   canvas.height,
              //   0,
              //   canvas.height,
              //   borderRadius
              // );
              // ctx.arcTo(0, canvas.height, 0, 0, borderRadius);
              // ctx.fill();

              // };

              // const image =
              //   "data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAZABkAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APNqKKK/Vz2gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBVVnYKqlmPQAZzU32O6/59pv++DWl4TGfFem/9dxXue1fQflXz+b528vqRgoc11fc8PNM3eBqKCje67nz19juv+fab/vg0fY7r/n2m/74NfQ21fQflRtX0H5V5P8ArdL/AJ9fieZ/rPL/AJ9/j/wD55+x3X/PtN/3waPsd1/z7Tf98GvobavoPyo2r6D8qP8AW6X/AD6/EP8AWeX/AD7/AB/4B88/Y7r/AJ9pv++DR9juv+fab/vg19DbV9B+VJtX0H5Uf63S/wCfX4h/rPL/AJ9/j/wD56+x3X/PtN/3waPsd1/z7Tf98GvoXavoPyo2r6D8qP8AW6X/AD6/EP8AWiX/AD7/AB/4B89fY7r/AJ9pv++DR9juv+fab/vg19CYX0H5UmF9B+VP/W2X/Pr8Rf60v/n3+P8AwD58+x3X/PtN/wB8Gk+x3P8Az7zf98GvoPA9B+VGF9B+VH+tsv8An1+P/AF/rTL/AJ9/j/wD58+x3P8Az7zf98Gl+x3X/PvN/wB8GvoHC+g/KjC+g/Kn/rbL/n1+P/AD/WqX/Pv8f+AfPv2O5/595v8Avg0v2O5/595v++DX0Fgeg/KkwvoPyo/1tl/z6/H/AIAf61P/AJ9/j/wD5++x3P8Az7zf98GkNpcgEm3lAHUlDX0Hgf3R+VVdUA/sm84H+oft/smqhxVKU1H2W/mXDidyko+z38/+AeAUUUV9ktUfWoKKKKBhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBs+Ev+Rr0z/ruK91rwrwn/yNemf9dxXutfBcWf7zD0PiuJv48PQKKKK+TPmgooooATFFBNNJpibFJpCaQmkJqkiHIUmkzTc0mapIhyHZpKbmjNVYnmHZoz70zNLm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Y934tsIciESTt/sjA/M1wpJJySSfekr0sPwvh4a1ZOX4HPPMqj0irGzf+Jb+9BRWEER/hj6/nWOTk5PX1pKK+goYWjh48tKKS8jhnUnN3k7hRRRW5AUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9k=";
              // console.log("with quotes");
              // bridge
              //   .send("VKWebAppShowStoryBox", {
              //     background_type: "none",
              //     stickers: [
              //       {
              //         sticker_type: "renderable",
              //         sticker: {
              //           can_delete: false,
              //           content_type: "image",
              //           blob: image,
              //           clickable_zones: [
              //             {
              //               action_type: "link",
              //               action: {
              //                 link: "https://vk.com/wall-166562603_1192",
              //                 tooltip_text_key: "tooltip_open_post"
              //               },
              //               clickable_area: [
              //                 {
              //                   x: 17,
              //                   y: 110
              //                 },
              //                 {
              //                   x: 97,
              //                   y: 110
              //                 },
              //                 {
              //                   x: 97,
              //                   y: 132
              //                 },
              //                 {
              //                   x: 17,
              //                   y: 132
              //                 }
              //               ]
              //             }
              //           ]
              //         }
              //       }
              //     ]
              //   })
              //   .catch(e => console.log("error", e));
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
        <FixedLayout vertical="top" className="SelectUsers__search">
          <Search
            // value=""
            onChange={searchUsers}
            after={null}
          />
        </FixedLayout>
        <List className="SelectUsers__list">
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
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Выбранный Юзер 2
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Выбранный Юзер 1
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
        </List>

        {/* <Placeholder */}
        {/* className="SelectUsers__placeholder" */}
        {/* action={ */}
        {/*   <Button */}
        {/*     size="l" */}
        {/*     onClick={() => { */}
        {/*       api.selectionChanged().catch(() => {}); */}
        {/*       // getAccessToken(); */}
        {/*       searchUsers(); */}
        {/*     }} */}
        {/*   > */}
        {/*     Предоставить доступ */}
        {/*   </Button> */}
        {/* } */}
        {/* > */}
        {/* Чтобы отмечать друзей и других людей в петиции, необходимо предоставить доступ к их списку */}
        {/* </Placeholder> */}
      </ModalPage>
    </ModalRoot>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        closeModal
      },
      dispatch
    )
  };
};

PetitionModal.propTypes = {
  currentPetition: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionModal);

import React from "react";
import {
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Button,
  Div,
  ANDROID,
  IOS,
  usePlatform,
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
import { connect } from "react-redux";
import {
  closeModal,
  openPopout,
  closePopout
} from "../../store/router/actions";
import { declOfNum } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const PetitionModal = ({
  currentPetition,
  closeModal,
  activeModal,
  openPopout,
  closePopout,
  launchParameters,
  appId
}) => {
  const fragmentText = (text, maxWidth, ctx) => {
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
          {launchParameters.vk_platform !== "mobile_web" && (
            <div
              className="PetitionModal__button-wrapper"
              onClick={() => {
                closePopout();
                openPopout(<ScreenSpinner />);

                const canvas = document.createElement("canvas");
                const r = 6;
                canvas.width = 240 * r;
                canvas.height = 318 * r;
                const ctx = canvas.getContext("2d");
                const borderRadius = 10 * r;
                const borderRadiusProgressBar = 2 * r;

                ctx.fillStyle = "#ffffff";
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
                ctx.clip();
                ctx.fill();
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                  const ratio = canvas.width / img.width;
                  ctx.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    img.width * ratio,
                    img.height * ratio
                  );

                  // button
                  ctx.fillStyle = "#4986cc";
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
                  ctx.font = `500 ${13 * r}px -apple-system`;
                  ctx.fillStyle = "#ffffff";
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

                  // progress bar text
                  ctx.font = `400 ${13 * r}px -apple-system`;
                  ctx.fillStyle = "#76787a";
                  const countSignatures = currentPetition.count_signatures;
                  const needSignatures = currentPetition.need_signatures;
                  const progressText = `${countSignatures.toLocaleString(
                    "ru"
                  )} из ${needSignatures.toLocaleString(
                    "ru"
                  )} ${declOfNum(needSignatures, [
                    "подписи",
                    "подписей",
                    "подписей"
                  ])}`;
                  const progressTextSize = ctx.measureText(progressText);

                  // progress bar
                  ctx.fillStyle = "#e1e3e6";
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
                  // progress bar filled
                  let progressBarWidth =
                    (countSignatures / needSignatures) *
                    (canvas.width - 16 * r - 16 * r);
                  ctx.fillStyle = "#3f8ae0";
                  if (countSignatures / needSignatures > 1) {
                    progressBarWidth = canvas.width - 16 * r - 16 * r;
                    ctx.fillStyle = "#4bb34b";
                  }

                  ctx.beginPath();
                  ctx.moveTo(
                    16 * r,
                    canvas.height - 16 * r - 36 * r - 16 * r - 2 * r
                  );
                  ctx.arcTo(
                    16 * r,
                    canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                    16 * r + progressBarWidth,
                    canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                    borderRadiusProgressBar
                  );
                  ctx.arcTo(
                    16 * r + progressBarWidth,
                    canvas.height - 16 * r - 36 * r - 16 * r - 4 * r,
                    16 * r + progressBarWidth,
                    canvas.height - 16 * r - 36 * r - 16 * r,
                    borderRadiusProgressBar
                  );
                  ctx.arcTo(
                    16 * r + progressBarWidth,
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

                  // title
                  const titleText = currentPetition.title;
                  ctx.font = `600 ${16 * r}px -apple-system`;
                  ctx.fillStyle = "#000000";
                  const lines = fragmentText(
                    titleText,
                    canvas.width - 16 * r - 32 * r,
                    ctx
                  );

                  if (progressTextSize.width > canvas.width - 16 * r - 16 * r) {
                    ctx.font = `400 ${13 * r}px -apple-system`;
                    ctx.fillStyle = "#76787a";
                    ctx.fillText(
                      `${countSignatures.toLocaleString("ru")} из`,
                      16 * r,
                      canvas.height -
                        16 * r -
                        36 * r -
                        16 * r -
                        4 * r -
                        8 * r -
                        13 * r
                    );
                    ctx.fillText(
                      `${needSignatures.toLocaleString(
                        "ru"
                      )} ${declOfNum(needSignatures, [
                        "подписи",
                        "подписей",
                        "подписей"
                      ])}`,
                      16 * r,
                      canvas.height - 16 * r - 36 * r - 16 * r - 4 * r - 8 * r
                    );

                    ctx.font = `600 ${16 * r}px -apple-system`;
                    ctx.fillStyle = "#000000";
                    for (const [i, line] of lines.entries()) {
                      if (16 * r * (i + 1) > 48 * r) {
                        ctx.fillText(
                          `${line.slice(0, -1)}...`,
                          16 * r,
                          11 * r + img.height * ratio + (i + 1) * 16 * r
                        );
                        break;
                      }
                      ctx.fillText(
                        line,
                        16 * r,
                        11 * r + img.height * ratio + (i + 1) * 16 * r
                      );
                    }
                  } else {
                    ctx.font = `400 ${13 * r}px -apple-system`;
                    ctx.fillStyle = "#76787a";
                    ctx.fillText(
                      progressText,
                      16 * r,
                      canvas.height - 16 * r - 36 * r - 16 * r - 4 * r - 8 * r
                    );
                    ctx.font = `600 ${16 * r}px -apple-system`;
                    ctx.fillStyle = "#000000";
                    for (const [i, line] of lines.entries()) {
                      if (16 * r * (i + 1) > 64 * r) {
                        ctx.fillText(
                          `${line.slice(0, -1)}...`,
                          16 * r,
                          11 * r + img.height * ratio + (i + 1) * 16 * r
                        );
                        break;
                      }
                      ctx.fillText(
                        line,
                        16 * r,
                        11 * r + img.height * ratio + (i + 1) * 16 * r
                      );
                    }
                  }

                  closePopout();
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
                                  app_id: appId,
                                  app_context: `#p${currentPetition.id}`
                                },
                                clickable_area: [
                                  {
                                    x: 16 * r,
                                    y: canvas.height - 16 * r - 36 * r
                                  },
                                  {
                                    x: canvas.width - 16 * r,
                                    y: canvas.height - 16 * r - 36 * r
                                  },
                                  {
                                    x: canvas.width - 16 * r,
                                    y: canvas.height - 16 * r
                                  },
                                  {
                                    x: 16 * r,
                                    y: canvas.height - 16 * r - 36 * r
                                  }
                                ]
                              }
                            ]
                          }
                        }
                      ]
                    })
                    .catch(() => {
                      closePopout();
                    });
                };
                img.onerror = () => {
                  closePopout();
                };
                img.src = currentPetition.mobile_photo_url;
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
          )}

          <div
            className="PetitionModal__button-wrapper"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              api.postToWall(
                "",
                `https://vk.com/app${appId}#p${currentPetition.id}`
              );
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
              api.shareLink(
                `https://vk.com/app${appId}#p${currentPetition.id}`
              );
            }}
          >
            <Button
              mode="secondary"
              className="PetitionModal__button-wrapper__button"
            >
              <Icon28ChainOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">
              Отправить сообщением
            </p>
          </div>
        </Div>
      </ModalPage>
    </ModalRoot>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current,
    launchParameters: state.data.launchParameters,
    appId: state.data.appId
  };
};

const mapDispatchToProps = {
  closeModal,
  openPopout,
  closePopout
};

PetitionModal.propTypes = {
  currentPetition: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  appId: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PetitionModal);

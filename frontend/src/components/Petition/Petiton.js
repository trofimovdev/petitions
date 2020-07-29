import React, { useEffect, useState } from "react";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Separator,
  Div,
  UsersStack,
  Avatar,
  Cell,
  Link,
  PullToRefresh,
  getClassName,
  usePlatform,
  Spinner,
  Button,
  Placeholder,
  Snackbar,
  ANDROID,
  Alert,
} from "@vkontakte/vkui";
import "./Petition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon28ReportOutline from "@vkontakte/icons/dist/28/report_outline";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Linkify from "react-linkify";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import PetitionTabbar from "../PetitionTabbar/PetitionTabbar";
import { closePopout, goBack, openPopout } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import {
  loadPetitions,
  userStackText,
  reportPetition,
} from "../../tools/helpers";

const api = new VKMiniAppAPI();

const Petition = ({
  id,
  goBack,
  currentPetition,
  activePanel,
  setCurrent,
  launchParameters,
  openPopout,
  closePopout
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [headerStatus, setHeaderStatus] = useState("hidden");
  const [snackbar, setSnackbar] = useState(null);
  const [reportStatus, setReportStatus] = useState(0);
  const platform = usePlatform();

  const setSnackbarError = message => {
    setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => setSnackbar()}
        before={
          <Avatar
            size={24}
            style={{
              backgroundColor: "var(--destructive)"
            }}
          >
            <Icon24Cancel fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        {message}
      </Snackbar>
    );
  };

  const onRefresh = () => {
    setFetchingStatus(true);
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      loadPetitions(`petitions`, true, {
        petition_id: currentPetition.id.toString()
      })
        .then(response => {
          setFetchingStatus(false);
          if (response && Object.keys(response).length > 0) {
            setCurrent(response[0]);
          } else {
            setCurrent({});
          }
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    } else {
      loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
        .then(response => {
          setFetchingStatus(false);
          if (response && Object.keys(response).length > 0) {
            setCurrent(response[0]);
          } else {
            setCurrent({});
          }
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    }
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 150) {
      setHeaderStatus("shown");
    } else {
      setHeaderStatus("hidden");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [currentPetition]);

  useEffect(() => {
    if (activePanel === "petition" && currentPetition.id) {
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
    }
    return () => {};
  }, [
    activePanel,
    currentPetition.id,
    launchParameters.vk_access_token_settings,
    loadingStatus,
    setCurrent
  ]);

  const linkDecorator = (href, text, key) => (
    <Link href={href} key={key} target="_blank">
      {text}
    </Link>
  );

  return (
    <Panel
      id={id}
      separator={false}
      className={`Petition ${
        currentPetition && currentPetition.completed && currentPetition.signed
          ? "Petition--signed"
          : ""
      }`}
    >
      <PanelHeader
        className={`Petition__header Petition__header__${headerStatus}`}
        left={
          <PanelHeaderButton
            onClick={() => {
              goBack();
              api.selectionChanged().catch(() => {});
            }}
          >
            {platform === ANDROID ? <Icon24Back /> : <Icon28ChevronBack />}
          </PanelHeaderButton>
        }
        separator={false}
      />
      {Object.keys(currentPetition).length < 3 && !loadingStatus ? (
        <Placeholder
          action={
            <Button
              size="l"
              onClick={() => {
                goBack();
                api.selectionChanged().catch(() => {});
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
          <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
            <div className="Petition__image">
              <img
                src={`${currentPetition.mobile_photo_url}`}
                alt="petition header"
              />
            </div>
            <Div className={getClassName("Petition__info", platform)}>
              <h1>{currentPetition.title}</h1>
              <PetitionProgress
                countSignatures={currentPetition.count_signatures}
                needSignatures={currentPetition.need_signatures}
                completed={currentPetition.completed}
              />
              {currentPetition.friends && currentPetition.friends.length > 0 && (
                <UsersStack
                  className="Petition__users-stack"
                  photos={currentPetition.friends.slice(0, 3).map(item => {
                    return item.user.photo_100;
                  })}
                >
                  {userStackText(currentPetition.friends)}
                </UsersStack>
              )}
            </Div>
            <Separator />
            <Div className="Petition__text">
              <Linkify componentDecorator={linkDecorator}>
                <p>{currentPetition.text}</p>
              </Linkify>
            </Div>
            <Separator />
            <Cell
              className="Petition__creator"
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
                className="Petition__creator__link"
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
            <Separator />
            <Cell
              className="Petition__report"
              before={<Icon28ReportOutline />}
              onClick={() => {
                if (reportStatus) {
                  return;
                }
                openPopout(
                  <Alert
                    actionsLayout="vertical"
                    onClose={() => closePopout()}
                    actions={[
                      {
                        title: "Пожаловаться",
                        autoclose: true,
                        mode: "destructive",
                        action: () => {
                          closePopout();
                          setReportStatus(1);
                          reportPetition(currentPetition.id)
                            .then(() => {
                              setReportStatus(2);
                            })
                            .catch(({ message }) => {
                              setSnackbarError(message);
                              setReportStatus(0);
                            });
                        }
                      },
                      {
                        title: "Отмена",
                        autoclose: true,
                        mode: "cancel"
                      }
                    ]}
                  >
                    <h2>Подтвердите действие</h2>
                    <p>
                      Вы действительно хотите удалить петицию? Это действие
                      нельзя будет отменить.
                    </p>
                  </Alert>
                );
              }}
            >
              {reportStatus === 0 ? (
                <>Пожаловаться на петицию</>
              ) : reportStatus === 1 ? (
                <>
                  Пожаловаться на петицию <Spinner size="small" />
                </>
              ) : (
                <>Жалоба отправлена</>
              )}
            </Cell>
          </PullToRefresh>
          <PetitionTabbar setSnackbarError={setSnackbarError} />
        </>
      ) : (
        <Spinner size="regular" className="ManagementFeed__spinner" />
      )}
      {snackbar}
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    activePanel: state.router.activePanel,
    currentPetition: state.petitions.current,
    launchParameters: state.data.launchParameters
  };
};

const mapDispatchToProps = {
  goBack,
  setCurrent,
  openPopout,
  closePopout
};

Petition.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  currentPetition: PropTypes.object,
  activePanel: PropTypes.string.isRequired,
  setCurrent: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Petition);

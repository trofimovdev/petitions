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
  Snackbar
} from "@vkontakte/vkui";
import "./Petition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import PetitionTabbar from "../PetitionTabbar/PetitionTabbar";
import { goBack } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import { declOfNum, loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const Petition = ({
  id,
  goBack,
  currentPetition,
  activePanel,
  setCurrent,
  launchParameters
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [headerStatus, setHeaderStatus] = useState("hidden");
  const [snackbar, setSnackbar] = useState(null);
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
          if (response) {
            setCurrent(response[0]);
          }
          api.selectionChanged().catch(() => {});
        })
        .catch(() => {});
    } else {
      loadPetitions(`petitions/${currentPetition.id.toString()}`, false)
        .then(response => {
          setFetchingStatus(false);
          if (response) {
            setCurrent(response[0]);
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
  }, [currentPetition]);

  useEffect(() => {
    if (activePanel === "petition") {
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
  }, [
    activePanel,
    currentPetition.id,
    launchParameters.vk_access_token_settings,
    loadingStatus,
    setCurrent
  ]);

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
            <Icon28ChevronBack />
          </PanelHeaderButton>
        }
        separator={false}
      />
      {Object.keys(currentPetition).length === 1 && !loadingStatus ? (
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
          Кажется, эта петиция была удалена.
        </Placeholder>
      ) : Object.keys(currentPetition).length > 1 ? (
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
            </Div>
            <Separator />
            <Div className="Petition__text">
              <p>{currentPetition.text}</p>
            </Div>
            <Separator />
            <Cell
              className="Petition__creator"
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

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        goBack,
        setCurrent
      },
      dispatch
    )
  };
};

Petition.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  currentPetition: PropTypes.object,
  activePanel: PropTypes.string.isRequired,
  setCurrent: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Petition);

import React from "react";
import {Panel, FixedLayout, Div, Placeholder, Separator} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { Welcome, Button, Link, TabItem, TabList } from "@happysanta/vk-app-ui";
import Icon16Add from "@vkontakte/icons/dist/16/add";
import PetitionCardDesktop from "../PetitionCardDesktop/PetitionCardDesktop";
import kanye from "../../img/kanye.png";
import dog from "../../img/dog.jpg";
import starwars from "../../img/starwars.jpg";
import { setPage } from "../../store/router/actions";
import "./SplashScreenDesktop.css";
import MainDesktop from "../MainDesktop/MainDesktop";

const api = new VKMiniAppAPI();

const SplashScreenDesktop = ({ id, activeView, setPage }) => {
  return (
    <div id={id} className="SplashScreenDesktop">
      <Welcome
        header="Петиции"
        description="Создавайте петиции, чтобы решать реальные проблемы"
        footer={
          <div>
            <Button
              mode="primary"
              onClick={() => setPage("petitions", "")}
              className="SplashScreenDesktop__buttons__next"
            >
              Далее
            </Button>
            <Button mode="secondary" onClick={() => api.addAppToCommunity()}>
              Установить в сообщество
            </Button>
          </div>
        }
      />
      <div className="SplashScreenDesktop__feed DesktopContainer">
        <TabList
          after={
            <Link className="create">
              <Icon16Add className="create__icon" />
              Создать петицию
            </Link>
          }
        >
          <TabItem selected>Популярные</TabItem>
          <TabItem>Последние</TabItem>
          <TabItem>Подписанные</TabItem>
          <TabItem>Мои петиции</TabItem>
        </TabList>
        <Div className="wrapper">
          <PetitionCardDesktop
            id={0}
            title="Канье в президенты 2024"
            countSignatures={200000}
            needSignatures={150000}
            webPhotoUrl={kanye}
            completed={false}
          />
          <Separator />
          <PetitionCardDesktop
            id={0}
            title="Выпустить девятый эпизод по сценарию Колина Треворроу"
            countSignatures={80000}
            needSignatures={100000}
            webPhotoUrl={starwars}
            completed
          />
          <Separator />
          <PetitionCardDesktop
            id={0}
            title={`"Мой пес — не чемодан!": требуем гуманности при транспортировке животных`}
            countSignatures={150000}
            needSignatures={200000}
            webPhotoUrl={dog}
            completed={false}
          />
        </Div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setPage
      },
      dispatch
    )
  };
};

SplashScreenDesktop.propTypes = {
  id: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(SplashScreenDesktop);

import React from "react";
import { Panel, Placeholder, Button, FixedLayout, Div } from "@vkontakte/vkui";
import "./SplashScreen.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PetitionCard from "../PetitionCard/PetitionCard";
import kanye from "../../img/kanye.png";
import { setPage } from "../../store/router/actions";

const api = new VKMiniAppAPI();

const SplashScreen = ({ id, activeView, setPage }) => {
  return (
    <Panel id={id} separator={false} className="SplashScreen">
      <Placeholder
        header="Хорошие петиции"
        icon={
          <PetitionCard
            id={0}
            title="Канье в президенты 2024"
            countSignatures={200000}
            needSignatures={150000}
            mobilePhotoUrl={kanye}
          />
        }
        stretched
      >
        Создавайте петиции, чтобы решать реальные проблемы.
      </Placeholder>
      <FixedLayout vertical="bottom">
        <Div className="SplashScreen__buttons">
          <Button
            size="xl"
            mode="primary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              setPage(activeView, "feed");
            }}
          >
            Далее
          </Button>
          <Button
            size="xl"
            mode="secondary"
            className="SplashScreen__buttons__install"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              api.addAppToCommunity();
            }}
          >
            Установить в сообщество
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = {
  setPage
};

SplashScreen.propTypes = {
  id: PropTypes.string.isRequired,
  activeView: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

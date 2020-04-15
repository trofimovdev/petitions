import React from "react";
import { Panel, Placeholder, Button, FixedLayout, Div } from "@vkontakte/vkui";
import "./SplashScreen.css";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PetitionCard from "../PetitionCard/PetitionCard";
import kanye from "../../img/kanye.png";
import { setPage } from "../../store/router/actions";

const SplashScreen = ({ id, activeView, setPage }) => {
  console.log(activeView);
  return (
    <Panel id={id} separator={false} className="SplashScreen">
      <Placeholder
        header="Петиции"
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
              setPage(activeView, "feed", false);
            }}
          >
            Далее
          </Button>
          <Button
            size="xl"
            mode="secondary"
            className="SplashScreen__buttons__install"
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

SplashScreen.propTypes = {
  id: PropTypes.string.isRequired,
  activeView: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

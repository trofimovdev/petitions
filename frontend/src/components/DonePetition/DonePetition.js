import React from "react";
import {
  Panel,
  Placeholder,
  Link,
  FixedLayout,
  Button,
  Div
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon56CheckCircleOutline from "@vkontakte/icons/dist/56/check_circle_outline";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setPage, openModal } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import "./DonePetition.css";

const api = new VKMiniAppAPI();

const DonePetition = ({
  id,
  setPage,
  openModal,
  currentPetition,
  setCurrent,
  activeView
}) => {
  return (
    <Panel id={id} separator={false} className="DonePetition">
      <Placeholder
        icon={<Icon56CheckCircleOutline className="DonePetition__icon" />}
        stretched
      >
        Петиция{" "}
        <Link
          className="DonePetition__title"
          onClick={() => {
            setCurrent({
              id: currentPetition.id,
              title: currentPetition.title
            });
            setPage(activeView, "petition", false, true, ["feed", "petition"]);
          }}
        >
          {`«${currentPetition.title}»`}
        </Link>{" "}
        запущена
      </Placeholder>
      <FixedLayout vertical="bottom" className="DonePetition__fixed-layout">
        <Div className="DonePetition__buttons">
          <Button
            size="xl"
            mode="primary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              openModal("share-type");
            }}
          >
            Поделиться
          </Button>
          <Button
            size="xl"
            mode="secondary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              setPage("management", "feed", false, true, ["feed"]);
            }}
          >
            Вернуться к списку петиций
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current,
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setPage,
        setCurrent,
        openModal
      },
      dispatch
    )
  };
};

DonePetition.propTypes = {
  id: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  currentPetition: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DonePetition);

import React from "react";
import {
  Div,
  Button,
  FixedLayout,
  getClassName,
  usePlatform
} from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./PetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { openModal } from "../../store/router/actions";

const api = new VKMiniAppAPI();

const PetitionTabbar = ({ openModal }) => {
  const platform = usePlatform();

  return (
    <FixedLayout
      vertical="bottom"
      className={`PetitionTabbar Tabbar--shadow ${getClassName(
        "Tabbar",
        platform
      )}`}
    >
      <div className="PetitionTabbar__signed">
        <Icon24DoneOutline className="PetitionTabbar__signed__icon" />
        Вы подписали эту петицию
      </div>
      <Div className="PetitionTabbar__buttons">
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            api.notificationOccurred("success").catch(() => {});
          }}
        >
          Подписать
        </Button>
        <Button
          size="l"
          mode="secondary"
          onClick={() => {
            api.selectionChanged().catch(() => {});
            console.log("try to open");
            console.log("active MODALKA", );
            openModal("share-type");
            console.log("opened");
          }}
        >
          <Icon24ShareOutline />
        </Button>
        <Button
          size="l"
          mode="secondary"
          onClick={() => {
            api.selectionChanged().catch(() => {});
          }}
        >
          <Icon24Settings />
        </Button>
      </Div>
    </FixedLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        openModal
      },
      dispatch
    )
  };
};

PetitionTabbar.propTypes = {
  openModal: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(PetitionTabbar);

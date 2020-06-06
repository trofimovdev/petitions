import React from "react";
import { Button, Panel, Placeholder } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { setStory } from "../../store/router/actions";

const api = new VKMiniAppAPI();

const NoInternet = ({ id, setStory, online }) => {
  return (
    <Panel id={id} separator={false}>
      <Placeholder
        stretched
        action={
          online && (
            <Button
              size="l"
              onClick={() => {
                setStory("petitions", "feed", false);
                api.selectionChanged().catch(() => {});
              }}
            >
              На главную
            </Button>
          )
        }
      >
        Приложение не работает без интернета
      </Placeholder>
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    online: state.data.online
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setStory
      },
      dispatch
    )
  };
};

NoInternet.propTypes = {
  id: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  online: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(NoInternet);

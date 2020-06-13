import React from "react";
import { Button, Panel, Placeholder } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { setPage } from "../../store/router/actions";

const api = new VKMiniAppAPI();

const NoInternet = ({ id, setPage, online }) => {
  return (
    <Panel id={id} separator={false}>
      <Placeholder
        stretched
        action={
          online && (
            <Button
              size="l"
              onClick={() => {
                setPage("petitions", "feed");
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
        setPage
      },
      dispatch
    )
  };
};

NoInternet.propTypes = {
  id: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  online: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(NoInternet);

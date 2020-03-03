import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Root, View, Panel, Button } from "@vkontakte/vkui";
import { goBack, setPage } from "../../store/router/actions";
import "@vkontakte/vkui/dist/vkui.css";

const MobileContainer = props => {
  console.log(props);
  const { setPage, activePanel } = props;
  return (
    <Root activeView="main">
      <View id="main" activePanel={activePanel} onSwipeBack={() => goBack()}>
        <Panel id="feed">
          this is feed
          <Button onClick={() => setPage("main", "test")}>
            перейти на test
          </Button>
        </Panel>

        <Panel id="test">
          this is test
          <Button onClick={() => setPage("main", "test2")}>
            перейти на test2
          </Button>
        </Panel>

        <Panel id="test2">
          this is test2
          <Button onClick={() => setPage("main", "test")}>
            перейти на test
          </Button>
        </Panel>
      </View>
    </Root>
  );
};

const mapStateToProps = state => {
  return {
    activeView: state.router.activeView,
    activePanel: state.router.activePanel
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ goBack, setPage }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileContainer);

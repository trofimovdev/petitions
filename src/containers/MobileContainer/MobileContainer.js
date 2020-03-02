import React, { Component } from "react";
import { connect } from "react-redux";
import { Root, View, ModalRoot } from "@vkontakte/vkui";
import {
  getOnErrorClose,
  removeFatalError
} from "../../store/FatalErrorModule";
import FatalErrorMobile from "../../components/FatalErrorMobile/FatalErrorMobile";
import { Route } from "../../routing/Route";
import {
  VIEW_MAIN,
  VIEW_2,
  VIEW_3,
  PANEL_MAIN,
  PANEL_ENTITY,
  PANEL_2_1,
  PANEL_2_2,
  PANEL_3_1,
  PANEL_3_2,
  MODAL_MAIN
} from "../../routing/routes";
import { popPage } from "../../routing/methods";
import "@vkontakte/vkui/dist/vkui.css";
import PanelExampleMain from "../../components/PanelExampleMain/PanelExampleMain";
import PanelExampleEntity from "../../components/PanelExampleEntity/PanelExampleEntity";
import PanelExampleTwoOne from "../../components/PanelExampleTwoOne/PanelExampleTwoOne";
import PanelExampleTwoTwo from "../../components/PanelExampleTwoTwo/PanelExampleTwoTwo";
import PanelExampleThreeOne from "../../components/PanelExampleThreeOne/PanelExampleThreeOne";
import PanelExampleThreeTwo from "../../components/PanelExampleThreeTwo/PanelExampleThreeTwo";
import ModalExampleMain from "../../components/ModalExampleMain/ModalExampleMain";

class MobileContainer extends Component {
  goBack() {
    popPage();
  }

  getViewHistory(route, viewId, emptyOnPopup = true) {
    const { viewHistory } = this.props;
    return emptyOnPopup && route.isModal() ? [] : viewHistory[viewId];
  }

  getPanelIdInView(route, viewId) {
    const viewHistory = this.props.viewHistory[viewId];
    const viewPanels = this.props.viewsPanels[viewId];
    const panelId = route.getPanelId();
    return ~viewHistory.indexOf(panelId)
      ? panelId
      : viewHistory.length > 0
      ? viewHistory[viewHistory.length - 1]
      : viewPanels[0];
  }

  renderModal(route) {
    return (
      <ModalRoot activeModal={route.getActiveModal()}>
        <ModalExampleMain id={MODAL_MAIN} onClose={() => this.goBack()} />
      </ModalRoot>
    );
  }

  getViewProps(viewId, route) {
    return {
      id: viewId,
      activePanel: this.getPanelIdInView(route, viewId),
      history: this.getViewHistory(route, viewId),
      modal: this.renderModal(route),
      onSwipeBack: () => popPage()
    };
  }

  render() {
    const { fatal, location } = this.props;
    if (fatal) {
      return (
        <FatalErrorMobile
          error={fatal}
          onClose={getOnErrorClose(fatal, () => this.props.removeFatalError())}
        />
      );
    }
    const route = Route.fromLocation(
      location.pathname,
      location.state,
      location.search
    );
    return (
      <Root activeView={route.getViewId()}>
        <View {...this.getViewProps(VIEW_MAIN, route)}>
          <PanelExampleMain id={PANEL_MAIN} />
          <PanelExampleEntity id={PANEL_ENTITY} />
        </View>
        <View {...this.getViewProps(VIEW_2, route)}>
          <PanelExampleTwoOne id={PANEL_2_1} />
          <PanelExampleTwoTwo id={PANEL_2_2} />
        </View>
        <View {...this.getViewProps(VIEW_3, route)}>
          <PanelExampleThreeOne id={PANEL_3_1} />
          <PanelExampleThreeTwo id={PANEL_3_2} />
        </View>
      </Root>
    );
  }
}

function mapStateToProps(state) {
  return {
    fatal: state.FatalErrorModule,
    viewHistory: state.LocationModule.viewHistory,
    viewsPanels: state.LocationModule.viewsPanels
  };
}

export default connect(mapStateToProps, { removeFatalError })(MobileContainer);

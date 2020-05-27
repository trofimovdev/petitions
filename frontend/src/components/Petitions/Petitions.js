import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PetitionsFeed from "../PetitionsFeed/PetitionsFeed";
import Petition from "../Petition/Petiton";
import PetitionModal from "../PetitionModal/PetititonModal";
import SplashScreen from "../SplashScreen/SplashScreen";
import {
  setActiveTab,
  setPage,
  setStory,
  goBack
} from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import EditPetition from "../EditPetition/EditPetition";

const Petitions = ({
  activeTab,
  activePanel,
  goBack,
  history,
  activeModal,
  popout
}) => {
  return (
    <View
      modal={<PetitionModal activeModal={activeModal} />}
      activePanel={activePanel}
      header={false}
      onSwipeBack={goBack}
      history={history}
      popout={popout}
    >
      <SplashScreen id="splashscreen" />
      <PetitionsFeed id="feed" activeTab={activeTab} />
      <Petition id="petition" />
      <EditPetition id="edit" />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    activeTab: state.router.activeTab,
    activePanel: state.router.activePanel,
    activeModal:
      state.router.activeModals[state.router.activeView] === undefined
        ? null
        : state.router.activeModals[state.router.activeView],
    popout:
      state.router.popouts[state.router.activeView] === undefined
        ? null
        : state.router.popouts[state.router.activeView]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setActiveTab,
        setStory,
        setPage,
        setCurrent,
        goBack
      },
      dispatch
    )
  };
};

Petitions.propTypes = {
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired,
  activeModal: PropTypes.string,
  goBack: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  popout: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Petitions);

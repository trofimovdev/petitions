import React, { useState } from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ManagementFeed from "../ManagementFeed/ManagementFeed";
import EditPetition from "../EditPetition/EditPetition";
import PetitionModal from "../PetitionModal/PetititonModal";
import { goBack } from "../../store/router/actions";
import Petition from "../Petition/Petiton";
import "./Management.css";
import SplashScreen from "../SplashScreen/SplashScreen";

const Management = ({
  id,
  activePanel,
  goBack,
  history,
  activeModal,
  formType
}) => {
  const [popout, setPopout] = useState(null);

  return (
    <View
      id={id}
      modal={<PetitionModal activeModal={activeModal} />}
      activePanel={activePanel}
      header={false}
      onSwipeBack={goBack}
      history={history}
      popout={popout}
    >
      <SplashScreen id="splashscreen" />
      <ManagementFeed id="feed" setPopout={setPopout} />
      <EditPetition id={formType} />
      <Petition id="petition" />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    activePanel: state.router.activePanel,
    activeModal:
      state.router.activeModals[state.router.activeView] === undefined
        ? null
        : state.router.activeModals[state.router.activeView],
    formType: state.petitions.formType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        goBack
      },
      dispatch
    )
  };
};

Management.propTypes = {
  id: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  activeModal: PropTypes.string,
  formType: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Management);

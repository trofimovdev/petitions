import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ManagementFeed from "../ManagementFeed/ManagementFeed";
import EditPetition from "../EditPetition/EditPetition";
import PetitionModal from "../PetitionModal/PetititonModal";
import { goBack, closeModal } from "../../store/router/actions";
import Petition from "../Petition/Petiton";
import "./Management.css";
import SplashScreen from "../SplashScreen/SplashScreen";
import DonePetition from "../DonePetition/DonePetition";

const Management = ({
  id,
  activePanel,
  goBack,
  history,
  activeModal,
  formType,
  popout
}) => {
  return (
    <View
      id={id}
      modal={
        <PetitionModal
          activeModal={activeModal}
          closeModal={() => closeModal()}
        />
      }
      activePanel={activePanel}
      header={false}
      onSwipeBack={goBack}
      history={history}
      popout={popout}
    >
      <SplashScreen id="splashscreen" />
      <ManagementFeed id="feed" />
      <Petition id="petition" />
      <EditPetition id="edit" formType={formType} />
      <DonePetition id="done" />
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
    formType: state.petitions.formType,
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
        goBack,
        closeModal
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
  formType: PropTypes.string.isRequired,
  popout: PropTypes.object,
  closeModal: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Management);

import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import ManagementFeed from "../ManagementFeed/ManagementFeed";
import EditPetition from "../EditPetition/EditPetition";
import PetitionModal from "../PetitionModal/PetititonModal";

const Management = ({
  id,
  activeStory,
  setStory,
  activeView,
  activePanel,
  setPage,
  goBack,
  openPopout,
  closePopout,
  petitions,
  setEdit,
  setCreate,
  activeViewPanelsHistory,
  openModal,
  closeModal,
  activeModal
}) => {
  return (
    <View
      id={id}
      modal={
        <PetitionModal activeModal={activeModal} closeModal={closeModal} />
      }
      activePanel={activePanel}
      header={false}
      onSwipeBack={goBack}
      history={activeViewPanelsHistory}
    >
      <ManagementFeed
        id="feed"
        activeStory={activeStory}
        setStory={setStory}
        activeView={activeView}
        activePanel={activePanel}
        setPage={setPage}
        openModal={openModal}
        closeModal={closeModal}
        petitions={petitions}
      />
      <EditPetition
        id={petitions.formType}
        activeStory={activeStory}
        activePanel={activePanel}
        setStory={setStory}
        setPage={setPage}
        goBack={goBack}
        openPopout={openPopout}
        closePopout={closePopout}
        petitions={petitions}
        setEdit={setEdit}
        setCreate={setCreate}
        type={petitions.formType}
        openModal={openModal}
      />
    </View>
  );
};

Management.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  activeViewPanelsHistory: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  activeModal: PropTypes.string
};

export default Management;

import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import PetitionsFeed from "../PetitionsFeed/PetitionsFeed";
import Petition from "../Petition/Petiton";
import PetitionModal from "../PetitionModal/PetititonModal";

const Petitions = ({
  setActiveTab,
  activeTab,
  activeView,
  activePanel,
  activeStory,
  setStory,
  setPage,
  activeModal,
  closeModal,
  openModal,
  petitions,
  goBack,
  activeViewPanelsHistory
}) => {
  return (
    <View
      modal={
        <PetitionModal activeModal={activeModal} closeModal={closeModal} />
      }
      activePanel={activePanel}
      header={false}
      onSwipeBack={goBack}
      history={activeViewPanelsHistory}
    >
      <PetitionsFeed
        id="feed"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        setPage={setPage}
        activeView={activeView}
        activeStory={activeStory}
        setStory={setStory}
        petitions={petitions}
      />
      <Petition
        id="petition"
        goBack={goBack}
        activeView={activeView}
        openModal={openModal}
      />
    </View>
  );
};

Petitions.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activeView: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  activeViewPanelsHistory: PropTypes.array.isRequired
};

export default Petitions;

import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import PetitionsFeed from "../PetitionsFeed/PetitionsFeed";
import Petition from "../Petition/Petiton";
import PetitionModal from "../PetitionModal/PetititonModal";

const Petitions = ({
  setActiveTab,
  activeTab,
  activePanel,
  activeStory,
  setStory,
  setPage,
  activeModal,
  closeModal,
  openModal,
  petitions
}) => {
  return (
    <View
      modal={
        <PetitionModal activeModal={activeModal} closeModal={closeModal} />
      }
      activePanel={activePanel}
      header={false}
    >
      <PetitionsFeed
        id="feed"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        setPage={setPage}
        activePanel={activePanel}
        activeStory={activeStory}
        setStory={setStory}
        petitions={petitions}
      />
      <Petition
        id="petition"
        setPage={setPage}
        activePanel={activePanel}
        openModal={openModal}
      />
    </View>
  );
};

Petitions.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired
};

export default Petitions;

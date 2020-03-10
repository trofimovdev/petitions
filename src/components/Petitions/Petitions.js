import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import PetitionsFeed from "../PetitionsFeed/PetitionsFeed";
import Petition from "../Petition/Petiton";

const Petitions = ({ setActiveTab, activeTab, activePanel, setPage }) => {
  return (
    <View activePanel={activePanel} header={false}>
      <PetitionsFeed
        id="feed"
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        setPage={setPage}
        activePanel={activePanel}
      />
      <Petition id="petition" />
    </View>
  );
};

Petitions.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default Petitions;

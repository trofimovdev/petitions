import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import ManagementFeed from "../ManagementFeed/ManagementFeed";
import Create from "../EditPetition/EditPetition";

const Management = ({ id, activeStory, setStory, activePanel, setPage }) => {
  return (
    <View id={id} activePanel={activePanel} header={false}>
      <ManagementFeed
        id="feed"
        activeStory={activeStory}
        setStory={setStory}
        activePanel={activePanel}
        setPage={setPage}
      />
      <Create
        id="create"
        activeStory={activeStory}
        activePanel={activePanel}
        setStory={setStory}
        setPage={setPage}
      />
    </View>
  );
};

Management.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default Management;

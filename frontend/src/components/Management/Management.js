import React from "react";
import { View } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import ManagementFeed from "../ManagementFeed/ManagementFeed";
import EditPetition from "../EditPetition/EditPetition";

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
  activeViewPanelsHistory
}) => {
  return (
    <View
      id={id}
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
      />
      <EditPetition
        id="create"
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
  activeViewPanelsHistory: PropTypes.array.isRequired
};

export default Management;

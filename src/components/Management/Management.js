import React, { useRef } from "react";
import "./Management.css";
import {
  Panel,
  PanelHeaderSimple,
  Separator,
  View,
  FixedLayout,
  Button,
  Div
} from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import PropTypes from "prop-types";
import PetitionCard from "../PetitionCard/PetitionCard";

const Management = ({ id, setActiveTab, activeTab, activePanel }) => {
  return (
    <View id={id} activePanel={activePanel} header={false}>
      <Panel id="feed" separator={false}>
        <PanelHeaderSimple separator={false}>Петиции</PanelHeaderSimple>
        <FixedLayout vertical="top">
          <Div style={{ paddingTop: `0px`, background: `#ffffff` }}>
            <Button before={<Icon24Add />} size="xl" mode="secondary">
              Создать петицию
            </Button>
          </Div>
        </FixedLayout>
        <Separator style={{ marginTop: `58px` }} />
        <div>
          <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
          <Separator />
          <PetitionCard title="Поместить Кобе Брайанта на новый логотип НБА" />
        </div>
      </Panel>
    </View>
  );
};

Management.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired
};

export default Management;

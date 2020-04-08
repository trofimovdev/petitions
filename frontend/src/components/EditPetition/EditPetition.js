import React, { useEffect } from "react";
import {
  Panel,
  PanelHeaderButton,
  PanelHeaderSimple,
  FormLayout,
  Input,
  Div,
  Button,
  Textarea,
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";
import UploadCard from "../UploadCard/UploadCard";
import EditPetitionTabbar from "../EditPetitionTabbar/EditPetitionTabbar";

const api = new VKMiniAppAPI();

const EditPetition = ({
  id,
  activeStory,
  setStory,
  activePanel,
  setPage,
  goBack
}) => {
  useEffect(() => {
    console.log("activePanel from editPetition", activePanel);
    if (activePanel === "create") {
      api.setLocationHash(activePanel);
    }
  }, [activePanel]);

  const handleFiles = e => {
    const { files } = e.target;
  };

  return (
    <Panel id={id} separator={false} className="EditPetition">
      <PanelHeaderSimple
        left={
          <PanelHeaderButton
            onClick={() => {
              goBack();
              api.selectionChanged().catch(() => {});
            }}
          >
            <Icon28ChevronBack />
          </PanelHeaderButton>
        }
      >
        Создание
      </PanelHeaderSimple>
      <FormLayout className="EditForm">
        <Input type="text" top="Название петиции" name="title" />
        <Textarea top="Текст петиции" />
        <Input
          type="number"
          top="Необходимое количество подписей"
          name="title"
          pattern="\d{0,3}"
        />
        <UploadCard
          id={1}
          title="Обложка для мобильной версии"
          onChange={e => console.log(e.target.files)}
          icon={<Icon48Camera />}
          text="Загрузить"
          size="l"
          bottomText="Рекомендуемый размер изображения: 1440×768px"
          img="https://petitions.trofimov.dev/static/1440x768.png"
        />
        <UploadCard
          id={2}
          title="Обложка для веб-версии"
          onChange={e => console.log(e)}
          icon={<Icon48Camera />}
          text="Загрузить"
          size="m"
          bottomText="Рекомендуемый размер изображения: 1360×300px"
          img="https://petitions.trofimov.dev/static/1360x300.png"
        />
      </FormLayout>
      <EditPetitionTabbar />
    </Panel>
  );
};

EditPetition.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired
};

export default EditPetition;

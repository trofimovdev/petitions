import React, { useState, useEffect } from "react";
import {
  Panel,
  PanelHeaderButton,
  PanelHeaderSimple,
  FormLayout,
  Input,
  Div,
  Button,
  Textarea,
  Snackbar,
  Avatar
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";
import Icon24Error from "@vkontakte/icons/dist/24/error";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import UploadCard from "../UploadCard/UploadCard";
import EditPetitionTabbar from "../EditPetitionTabbar/EditPetitionTabbar";

const api = new VKMiniAppAPI();

const EditPetition = ({
  id,
  activeStory,
  setStory,
  activePanel,
  setPage,
  goBack,
  openPopout,
  closePopout,
  petitions,
  setEdit,
  setCreate
}) => {
  const [snackbar, setSnackbar] = useState(null);
  console.log("CREATE PETITIONS", petitions);

  useEffect(() => {
    console.log("activePanel from editPetition", activePanel);
    if (activePanel === "create") {
      api.setLocationHash(activePanel);
    }
  }, [activePanel]);

  const onChange = e => {
    const { name, value } = e.currentTarget;
    setCreate({ [name]: value });
  };

  const redBackground = {
    backgroundColor: "var(--destructive)"
  };

  const handleFiles = e => {
    const file_id = e.currentTarget.id;
    const { files } = e.target;
    if (files.length === 1) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = j => {
        const fileSize = j.total; // в байтах
        console.log("fileSize", fileSize);
        if (fileSize > 1 * 10 ** 6) {
          // максимальный размер - 10 мегабайт
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar()}
              before={
                <Avatar size={24} style={redBackground}>
                  <Icon24Cancel fill="#fff" width={14} height={14} />
                </Avatar>
              }
            >
              Слишком большой размер файла
            </Snackbar>
          );
        }
        setCreate({ [file_id]: j.target.result });
      };
    }
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
        <Input
          type="text"
          top={
            <div className="EditForm__input-top">
              <span>Название</span>
              <span>
                {petitions.create.title ? petitions.create.title.length : 0}/150
              </span>
            </div>
          }
          status={
            petitions.create.title && petitions.create.title.length > 150
              ? "error"
              : ""
          }
          bottom={
            petitions.create.title && petitions.create.title.length > 150
              ? "Слишком длинное название петиции"
              : ""
          }
          value={petitions.create.title ? petitions.create.title : ""}
          name="title"
          onChange={onChange}
        />
        <Textarea
          name="text"
          top={
            <div className="EditForm__input-top">
              <span>Текст петиции</span>
              <span>
                {petitions.create.text ? petitions.create.text.length : 0}/5000
              </span>
            </div>
          }
          bottom={
            petitions.create.text && petitions.create.text.length > 5000
              ? "Слишком длинный текст петиции"
              : ""
          }
          value={petitions.create.text ? petitions.create.text : ""}
          onChange={onChange}
        />
        <Input
          type="number"
          top="Необходимое количество подписей"
          name="signatures"
          pattern="\d{0,3}"
          value={petitions.create.signatures ? petitions.create.signatures : ""}
          onChange={onChange}
        />
        <UploadCard
          id={1}
          title="Обложка для мобильной версии"
          onChange={handleFiles}
          icon={<Icon48Camera />}
          text="Загрузить"
          size="l"
          bottomText="Рекомендуемый размер изображения: 1440×768px"
          img={petitions.create.file_1 ? petitions.create.file_1 : null}
        />
        <UploadCard
          id={2}
          title="Обложка для веб-версии"
          onChange={handleFiles}
          icon={<Icon48Camera />}
          text="Загрузить"
          size="m"
          bottomText="Рекомендуемый размер изображения: 1360×300px"
          img={petitions.create.file_2 ? petitions.create.file_2 : null}
        />
      </FormLayout>

      {snackbar}
      <EditPetitionTabbar form={petitions.create} />
    </Panel>
  );
};

EditPetition.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  petitions: PropTypes.object.isRequired,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired
};

export default EditPetition;

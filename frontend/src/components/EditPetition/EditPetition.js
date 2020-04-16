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
  Avatar,
  getClassName,
  usePlatform
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";
import Icon24Error from "@vkontakte/icons/dist/24/error";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon28Mention from "@vkontakte/icons/dist/28/mention";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import UploadCard from "../UploadCard/UploadCard";
import EditPetitionTabbar from "../EditPetitionTabbar/EditPetitionTabbar";
import { goBack, openModal } from "../../store/router/actions";
import { setEdit, setCreate } from "../../store/petitions/actions";

const api = new VKMiniAppAPI();

const EditPetition = ({
  id,
  activePanel,
  goBack,
  formType,
  setEdit,
  setCreate,
  openModal,
  editPetitions,
  createPetitions
}) => {
  const [snackbar, setSnackbar] = useState(null);

  let setForm = () => {};
  let form = {};
  let panelTitle = "";
  console.log(formType);
  switch (formType) {
    case "edit": {
      setForm = setEdit;
      form = editPetitions;
      panelTitle = "Редактирование";
      break;
    }

    case "create": {
      setForm = setCreate;
      form = createPetitions;
      panelTitle = "Создание";
      break;
    }

    default: {
      setForm = setCreate;
      form = createPetitions;
      panelTitle = "Создание";
    }
  }

  useEffect(() => {
    if (activePanel === "create") {
      api.setLocationHash(activePanel);
    }
  }, [activePanel]);

  const onChange = e => {
    const { name, value } = e.currentTarget;
    setForm({ [name]: value });
  };

  const onCancel = e => {
    setForm({ [e.currentTarget.id]: undefined });
    e.preventDefault();
  };

  const redBackground = {
    backgroundColor: "var(--destructive)"
  };

  const platform = usePlatform();

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
        setForm({ [file_id]: j.target.result });
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
        {panelTitle}
      </PanelHeaderSimple>
      <FormLayout className="EditForm">
        <Input
          type="text"
          top="Название"
          // TODO: вынести в константу с бэкенда
          status={form.title && form.title.length > 150 ? "error" : ""}
          bottom={
            form.title && form.title.length > 150
              ? "Слишком длинное название петиции"
              : ""
          }
          value={form.title ? form.title : ""}
          name="title"
          onChange={onChange}
        />
        <Textarea
          name="text"
          top="Текст петиции"
          // TODO: вынести в константу с бэкенда
          status={form.text && form.text.length > 150 ? "error" : ""}
          bottom={
            form.text && form.text.length > 5000
              ? "Слишком длинный текст петиции"
              : ""
          }
          value={form.text ? form.text : ""}
          onChange={onChange}
        />
        <Input
          type="number"
          top="Необходимое количество подписей"
          name="signatures"
          pattern="\d*"
          value={form.signatures ? parseInt(form.signatures) : ""}
          // TODO: вынести в константу с бэкенда
          status={
            !form.signatures ||
            (form.signatures <= 10000000 && form.signatures >= 1)
              ? ""
              : "error"
          }
          bottom={
            form.signatures &&
            (form.signatures > 10000000
              ? `Максимально можно собрать ${(10000000).toLocaleString()} подписей`
              : form.signatures < 1
              ? `Минимально можно собрать 1 подпись`
              : "")
          }
          onChange={onChange}
        />

        <>
          <div className="FormLayout__row-top">Кому направлена петиция</div>
          <div
            className={`FormField Input ${getClassName("FormField", platform)}`}
          >
            <div className="EditForm__input-wrapper">
              <input
                type="text"
                name="directedTo"
                className="Input__el"
                value={form.directedTo ? form.directedTo : ""}
                onChange={onChange}
              />
              <Icon28Mention
                onClick={() => {
                  api.selectionChanged().catch(() => {});
                  console.log("try to open");
                  openModal("select-users");
                  console.log("opened");
                }}
              />
            </div>
            <div className="FormField__border" />
          </div>
        </>

        <UploadCard
          id={1}
          title="Обложка для мобильной версии"
          onChange={handleFiles}
          icon={<Icon48Camera />}
          text="Загрузить"
          size="l"
          bottomText="Рекомендуемый размер изображения: 1440×768px"
          onCancel={onCancel}
          img={form.file_1 ? form.file_1 : null}
        />
        <UploadCard
          id={2}
          title="Обложка для веб-версии"
          onChange={handleFiles}
          icon={<Icon48Camera />}
          text="Загрузить"
          size="m"
          bottomText="Рекомендуемый размер изображения: 1360×300px"
          onCancel={onCancel}
          img={form.file_2 ? form.file_2 : null}
        />
      </FormLayout>

      {snackbar}
      <EditPetitionTabbar
        disabled={
          !(
            form.title &&
            form.title.length <= 150 &&
            form.text &&
            form.text.length <= 5000 &&
            form.signatures &&
            form.signatures >= 1 &&
            form.signatures <= 10000000 &&
            form.file_1 &&
            form.file_2
          )
        }
      />
    </Panel>
  );
};

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory,
    activePanel: state.router.activePanel,
    formType: state.petitions.formType,
    editPetitions: state.petitions.edit,
    createPetitions: state.petitions.create
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        goBack,
        setEdit,
        setCreate,
        openModal
      },
      dispatch
    )
  };
};

EditPetition.propTypes = {
  id: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetition);

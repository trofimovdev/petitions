import React, { useState } from "react";
import {
  Panel,
  PanelHeaderButton,
  PanelHeader,
  FormLayout,
  Input,
  Textarea,
  Snackbar,
  Avatar
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon28CameraOutline from "@vkontakte/icons/dist/28/camera_outline";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import UploadCard from "../UploadCard/UploadCard";
import EditPetitionTabbar from "../EditPetitionTabbar/EditPetitionTabbar";
import { goBack } from "../../store/router/actions";
import { setEdit, setCreate } from "../../store/petitions/actions";
import { filterString } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const EditPetition = ({
  id,
  goBack,
  formType,
  setEdit,
  setCreate,
  editPetitions,
  createPetitions
}) => {
  const [snackbar, setSnackbar] = useState(null);
  const MAX_FILE_SIZE = 10 * 10 ** 6; // максимальный размер - 10 мегабайт

  const checkFileSize = fileSize => {
    if (fileSize > MAX_FILE_SIZE) {
      setSnackbar(
        <Snackbar
          layout="vertical"
          onClose={() => setSnackbar()}
          before={
            <Avatar
              size={24}
              style={{
                backgroundColor: "var(--destructive)"
              }}
            >
              <Icon24Cancel fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          Слишком большой размер файла
        </Snackbar>
      );
      return false;
    }
    return true;
  };

  const checkFileType = type => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(type)) {
      setSnackbar(
        <Snackbar
          layout="vertical"
          onClose={() => setSnackbar()}
          before={
            <Avatar
              size={24}
              style={{
                backgroundColor: "var(--destructive)"
              }}
            >
              <Icon24Cancel fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          Это не изображение
        </Snackbar>
      );
      return false;
    }
    return true;
  };

  let setForm = () => {};
  let form = {};
  let panelTitle = "";
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

  const onChange = e => {
    const { name, value } = e.currentTarget;
    setForm({
      ...form,
      ...{
        [name]: filterString(value)
      }
    });
  };

  const onCancel = e => {
    const file_preview = `${e.currentTarget.id}_preview`;
    delete form[e.currentTarget.id];
    delete form[file_preview];
    setForm({
      ...form
    });
    e.preventDefault();
  };

  const handleFiles = e => {
    const file_id = e.currentTarget.id;
    const { files } = e.target;
    if (files.length === 1) {
      const reader = new FileReader();
      reader.onload = j => {
        const preview = j.target.result;
        const file = files[0];
        const fileSize = j.total; // в байтах
        if (!checkFileSize(fileSize) || !checkFileType(file.type)) {
          return;
        }
        // const ext = /[^.]+$/.exec(filename)
        const file_preview = `${file_id}_preview`;
        setForm({ ...form, ...{ [file_preview]: preview, [file_id]: file } });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onNumberChange = e => {
    const { name, value } = e.currentTarget;
    setForm({
      ...form,
      ...{
        [name]: value
          .replace(/[^[:print:]\s]/g, "")
          .replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            ""
          )
          .replace(/[^0-9]/g, "")
      }
    });
  };

  return (
    <Panel id={id} separator={false} className="EditPetition">
      <PanelHeader
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
      </PanelHeader>
      <FormLayout className="EditForm">
        {formType === "create" && (
          <Input
            type="text"
            top="Название"
            status={form.title && form.title.length > 150 ? "error" : ""}
            bottom={
              form.title && form.title.length > 150
                ? "Слишком длинное название петиции"
                : ""
            }
            value={form.title ? form.title : ""}
            name="title"
            onChange={onChange}
            placeholder="Введите название"
          />
        )}
        <Textarea
          name="text"
          top="Текст петиции"
          // TODO: вынести в константу с бэкенда
          status={form.text && form.text.length > 3000 ? "error" : ""}
          bottom={
            form.text && form.text.length > 3000
              ? "Слишком длинный текст петиции"
              : ""
          }
          value={form.text ? form.text : ""}
          onChange={onChange}
          placeholder="Введите текст"
        />
        <Input
          top="Необходимое количество подписей"
          name="need_signatures"
          type="number"
          pattern="\d*"
          value={form.need_signatures ? parseInt(form.need_signatures) : ""}
          status={
            !form.need_signatures ||
            (form.need_signatures <= 10000000 && form.need_signatures >= 1)
              ? ""
              : "error"
          }
          bottom={
            form.need_signatures &&
            (form.need_signatures > 10000000
              ? `Максимально можно собрать ${(10000000).toLocaleString(
                  "ru"
                )} подписей`
              : form.need_signatures < 1
              ? `Минимально можно собрать 1 подпись`
              : "")
          }
          onChange={onNumberChange}
          placeholder="Введите количество подписей"
        />

        <Input
          type="text"
          top="Кому направлена петиция"
          name="directed_to"
          value={form.directed_to ? form.directed_to : ""}
          status={
            form.directed_to && form.directed_to.length > 255 ? "error" : ""
          }
          bottom={
            form.directed_to && form.directed_to.length > 255
              ? "Слишком много символов"
              : ""
          }
          onChange={onChange}
          placeholder="Введите адресата"
        />

        <UploadCard
          id={1}
          title="Обложка для мобильной версии"
          onChange={handleFiles}
          icon={<Icon28CameraOutline />}
          text="Загрузить обложку"
          size="l"
          bottomText="Рекомендуемый размер изображения: 1440×768px"
          onCancel={onCancel}
          img={form.file1_preview ? form.file1_preview : null}
        />
        <UploadCard
          id={2}
          title="Обложка для веб-версии"
          onChange={handleFiles}
          icon={<Icon28CameraOutline />}
          text="Загрузить обложку"
          size="m"
          bottomText="Рекомендуемый размер изображения: 1360×320px"
          onCancel={onCancel}
          img={form.file2_preview ? form.file2_preview : null}
        />
      </FormLayout>

      {snackbar}
      <EditPetitionTabbar
        disabled={
          !(
            form.title &&
            form.title.length <= 150 &&
            form.text &&
            form.text.length <= 3000 &&
            form.need_signatures &&
            form.need_signatures >= 1 &&
            form.need_signatures <= 10000000 &&
            (!form.directed_to ||
              (form.directed_to && form.directed_to.length <= 255))
          )
        }
        setSnackbar={setSnackbar}
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
        setCreate
      },
      dispatch
    )
  };
};

EditPetition.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  formType: PropTypes.string,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetition);

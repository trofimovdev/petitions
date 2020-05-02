import React, { useState, useEffect } from "react";
import {
  Panel,
  PanelHeaderButton,
  PanelHeader,
  FormLayout,
  Input,
  Textarea,
  Snackbar,
  Avatar,
  getClassName,
  usePlatform,
  IOS
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import UploadCard from "../UploadCard/UploadCard";
import EditPetitionTabbar from "../EditPetitionTabbar/EditPetitionTabbar";
import { goBack } from "../../store/router/actions";
import { setEdit, setCreate } from "../../store/petitions/actions";

const api = new VKMiniAppAPI();

const EditPetition = ({
  id,
  activePanel,
  goBack,
  formType,
  setEdit,
  setCreate,
  editPetitions,
  createPetitions
}) => {
  const [snackbar, setSnackbar] = useState(null);
  const MAX_FILE_SIZE = 10 * 10 ** 6; // максимальный размер - 10 мегабайт
  const platform = usePlatform();

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

  // fast magic
  const getOrientation = (file, callback) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const view = new DataView(e.target.result);
      if (view.getUint16(0, false) != 0xffd8) {
        return callback(-2);
      }
      const length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966) {
            return callback(-1);
          }

          const little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) == 0x0112) {
              return callback(view.getUint16(offset + i * 12 + 8, little));
            }
          }
        } else if ((marker & 0xff00) != 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file);
  };

  const rotateImage = (base64, deg) => {
    const canvas = document.createElement("rotateImage_canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = base64;
    image.onload = () => {
      const w = image.width;
      const h = image.height;
      const rads = (deg * Math.PI) / 180;
      let c = Math.cos(rads);
      let s = Math.sin(rads);
      if (s < 0) {
        s = -s;
      }
      if (c < 0) {
        c = -c;
      }
      canvas.width = h * s + w * c;
      canvas.height = h * c + w * s;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      // TODO: remove canvas from body
      return canvas.toDataURL();
    };
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
    const file_preview = `${e.currentTarget.id}_preview`;
    setForm({ [e.currentTarget.id]: undefined, [file_preview]: undefined });
    e.preventDefault();
  };

  const handleFiles = e => {
    const file_id = e.currentTarget.id;
    const { files } = e.target;
    if (files.length === 1) {
      getOrientation(files[0], orientation => {
        console.log("orientation", orientation);
        const reader = new FileReader();
        reader.onload = j => {
          let preview = j.target.result;
          let file = files[0];

          // if (orientation === 6 && platform === IOS) {
          //   console.log("превью норм а загружается говно");
          // } else if (image.width > image.height && orientation === 1 && platform === IOS) {
          //   console.log("small size превью говно и загружается говно");
          // }

          const fileSize = j.total; // в байтах
          if (!checkFileSize(fileSize)) {
            return;
          }
          const file_preview = `${file_id}_preview`;
          setForm({ [file_preview]: preview, [file_id]: file });
        };
        reader.readAsDataURL(files[0]);
      });
    }
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
          status={form.text && form.text.length > 3000 ? "error" : ""}
          bottom={
            form.text && form.text.length > 3000
              ? "Слишком длинный текст петиции"
              : ""
          }
          value={form.text ? form.text : ""}
          onChange={onChange}
        />
        <Input
          type="number"
          top="Необходимое количество подписей"
          name="need_signatures"
          pattern="\d*"
          value={form.need_signatures ? parseInt(form.need_signatures) : ""}
          // TODO: вынести в константу с бэкенда
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
                name="directed_to"
                className="Input__el"
                value={form.directed_to ? form.directed_to : ""}
                onChange={onChange}
              />
              {/* <Icon28Mention */}
              {/*  onClick={() => { */}
              {/*    api.selectionChanged().catch(() => {}); */}
              {/*    openModal("select-users"); */}
              {/*  }} */}
              {/* /> */}
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
          img={form.file1_preview ? form.file1_preview : null}
        />
        <UploadCard
          id={2}
          title="Обложка для веб-версии"
          onChange={handleFiles}
          icon={<Icon48Camera />}
          text="Загрузить"
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
            form.file1 &&
            form.file2
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
  activePanel: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  formType: PropTypes.string,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetition);

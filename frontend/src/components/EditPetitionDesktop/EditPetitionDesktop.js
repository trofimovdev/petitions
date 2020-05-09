import React, { useState } from "react";
import { Div } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetitionDesktop.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Input, Textarea, TooltipTag, Button } from "@happysanta/vk-app-ui";
import UploadCard from "../UploadCard/UploadCard";
import {
  setEdit,
  setCreate,
  setCurrent,
  setManaged
} from "../../store/petitions/actions";
import { setPage } from "../../store/router/actions";
import HeaderDesktop from "../HeaderDesktop/HeaderDesktop";
import Backend from "../../tools/Backend";

const EditPetitionDesktop = ({
  id,
  setPage,
  formType,
  setEdit,
  setCreate,
  editPetitions,
  createPetitions,
  setCurrent,
  setManaged,
  initialEditPetitions,
  managedPetitions
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(null);
  const MAX_FILE_SIZE = 10 * 10 ** 6; // максимальный размер - 10 мегабайт

  const checkFileSize = fileSize => {
    if (fileSize > MAX_FILE_SIZE) {
      // setSnackbar(
      //   <Snackbar
      //     layout="vertical"
      //     onClose={() => setSnackbar()}
      //     before={
      //       <Avatar
      //         size={24}
      //         style={{
      //           backgroundColor: "var(--destructive)"
      //         }}
      //       >
      //         <Icon24Cancel fill="#fff" width={14} height={14} />
      //       </Avatar>
      //     }
      //   >
      //     Слишком большой размер файла
      //   </Snackbar>
      // );
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
      panelTitle = "Редактирование петиции";
      break;
    }

    case "create": {
      setForm = setCreate;
      form = createPetitions;
      panelTitle = "Создание петиции";
      break;
    }

    default: {
      setForm = setCreate;
      form = createPetitions;
      panelTitle = "Создание петиции";
    }
  }

  const onChange = e => {
    const { name, value } = e.currentTarget;
    console.log(name, value, form);
    setForm({ ...form, ...{ [name]: value } });
  };

  const onCancel = e => {
    const file_preview = `${e.currentTarget.id}_preview`;
    setForm({
      ...form,
      ...{ [e.currentTarget.id]: undefined, [file_preview]: undefined }
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
        if (!checkFileSize(fileSize)) {
          return;
        }
        const file_preview = `${file_id}_preview`;
        setForm({ ...form, ...{ [file_preview]: preview, [file_id]: file } });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div id={id} className="EditPetitionDesktop">
      <HeaderDesktop
        title={panelTitle}
        goBack={() => setPage("petitions", "")}
      />
      <Div className="form">
        <Div
          className={`form__row ${
            form.title && form.title.length > 150 ? "form__row_error" : ""
          }`}
        >
          <label htmlFor="title">Название петиции</label>
          <Input
            id="title"
            name="title"
            type="text"
            value={form.title ? form.title : ""}
            onChange={onChange}
          />
          <p className="form__row_error__text">
            Слишком длинное название петиции
          </p>
        </Div>

        <Div
          className={`form__row ${
            form.need_signatures > 10000000 || form.need_signatures < 1
              ? "form__row_error"
              : ""
          }`}
        >
          <label htmlFor="need_signatures">
            Необходимое количество подписей
          </label>
          <Input
            id="need_signatures"
            name="need_signatures"
            type="number"
            value={form.need_signatures ? parseInt(form.need_signatures) : ""}
            onChange={onChange}
          />
          <p className="form__row_error__text">
            Можно собрать от 1 до 10 000 000 подписей
          </p>
        </Div>

        <Div className="form__row">
          <label htmlFor="need_signatures">Кому направлена петиция</label>
          <Input
            id="directed_to"
            name="directed_to"
            type="text"
            value={form.directed_to ? form.directed_to : ""}
            onChange={onChange}
          />
        </Div>

        <Div
          className={`form__row ${
            form.text && form.text.length > 3000 ? "form__row_error" : ""
          }`}
        >
          <label htmlFor="text">Текст петиции</label>
          <Textarea
            id="text"
            name="text"
            adapt
            maxHeight={200}
            value={form.text ? form.text : ""}
            onChange={onChange}
          />
          <p className="form__row_error__text">Слишком длинный текст петиции</p>
        </Div>

        <Div className="form__row">
          <label htmlFor="text">
            Обложка для веб-версии
            <TooltipTag>
              Рекомендуемый размер изображения: 1360x320px
            </TooltipTag>
          </label>
          <UploadCard
            id={2}
            text="Загрузить обложку"
            icon={<Icon48Camera />}
            size="m"
            onChange={handleFiles}
            onCancel={onCancel}
            img={form.file2_preview ? form.file2_preview : null}
          />
        </Div>

        <Div className="form__row">
          <label htmlFor="text">
            Обложка для мобильной версии
            <TooltipTag>
              Рекомендуемый размер изображения: 1440x768px
            </TooltipTag>
          </label>
          <UploadCard
            id={1}
            text="Загрузить обложку"
            icon={<Icon48Camera />}
            size="l"
            onChange={handleFiles}
            onCancel={onCancel}
            img={form.file1_preview ? form.file1_preview : null}
          />
        </Div>

        <Div>
          <Button
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
            loading={fetchingStatus}
            onClick={() => {
              setFetchingStatus(true);
              const form =
                formType === "edit"
                  ? { ...editPetitions }
                  : { ...createPetitions };
              if (formType === "edit") {
                const changed = new FormData();
                for (const [key, value] of Object.entries(
                  initialEditPetitions
                )) {
                  if (form[key] === value || key.includes("preview")) {
                    continue;
                  }
                  if (["file1", "file2"].includes(key)) {
                    changed.append("images", "true");
                    changed.append(key, form[key], "img");
                    continue;
                  }
                  changed.append(key, form[key]);
                }
                if (form.file1_preview === form.file2_preview) {
                  changed.append("file", form.file1);
                  changed.delete("file1");
                  changed.delete("file2");
                }
                Backend.request(`petitions/${form.id}`, changed, "PATCH")
                  .then(response => {
                    setFetchingStatus(false);
                    // изменени сохранены
                  })
                  .catch(({ message }) => {
                    setFetchingStatus(false);
                    // error {{ message }}
                  });
                return;
              }

              const formData = new FormData();
              Object.entries(form).forEach(pair => {
                if (!pair[0].includes("preview")) {
                  if (["file1", "file2"].includes(pair[0])) {
                    formData.append(pair[0], pair[1], "img");
                  } else {
                    formData.append(pair[0], pair[1]);
                  }
                }
              });
              formData.append("type", "create");
              Backend.request("petitions", formData, "POST")
                .then(response => {
                  setCurrent({
                    id: response.id,
                    title: response.title,
                    count_signatures: response.count_signatures,
                    need_signatures: response.need_signatures,
                    mobile_photo_url: response.mobile_photo_url,
                    web_photo_url: response.web_photo_url
                  });
                  setManaged(
                    [
                      {
                        id: response.id,
                        title: response.title,
                        web_photo_url: response.web_photo_url,
                        count_signatures: response.count_signatures,
                        need_signatures: response.need_signatures
                      }
                    ].concat(managedPetitions)
                  );
                  setFetchingStatus(false);
                  setCreate({
                    title: undefined,
                    text: undefined,
                    need_signatures: undefined,
                    directed_to: undefined,
                    file1: undefined,
                    file1_preview: undefined,
                    file2: undefined,
                    file2_preview: undefined
                  });
                  // setPage(activeView, "done", false, true, ["done"]);
                })
                .catch(({ code, message }) => {
                  setFetchingStatus(false);
                  // error {{ message }}
                });
            }}
          >
            Запустить
          </Button>
        </Div>
      </Div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeStory: state.router.activeStory,
    formType: state.petitions.formType,
    editPetitions: state.petitions.edit,
    createPetitions: state.petitions.create,
    initialEditPetitions: state.petitions.initialEdit,
    managedPetitions: state.petitions.managed
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setEdit,
        setCreate,
        setPage,
        setCurrent,
        setManaged
      },
      dispatch
    )
  };
};

EditPetitionDesktop.propTypes = {
  id: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  formType: PropTypes.string,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setManaged: PropTypes.func.isRequired,
  initialEditPetitions: PropTypes.object.isRequired,
  managedPetitions: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPetitionDesktop);

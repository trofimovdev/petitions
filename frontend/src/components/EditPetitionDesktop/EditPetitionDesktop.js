import React, { useState } from "react";
import {Avatar, Div, Snackbar} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./EditPetitionDesktop.css";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Input,
  Textarea,
  TooltipTag,
  Button,
  FadeInOut,
  Gray
} from "@happysanta/vk-app-ui";
import UploadCard from "../UploadCard/UploadCard";
import {
  setEdit,
  setCreate,
  setCurrent,
  setManaged,
  setPopular,
  setLast,
  setSigned
} from "../../store/petitions/actions";
import { setPage } from "../../store/router/actions";
import HeaderDesktop from "../HeaderDesktop/HeaderDesktop";
import Backend from "../../tools/Backend";
import { loadPetitions } from "../../tools/helpers";

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
  setPopular,
  setLast,
  setSigned,
  launchParameters
}) => {
  const [fetchingStatus, setFetchingStatus] = useState(null);
  const [ts, setTs] = useState({ time: undefined, message: undefined });
  const MAX_FILE_SIZE = 10 * 10 ** 6; // максимальный размер - 10 мегабайт

  const checkFileSize = fileSize => {
    if (fileSize > MAX_FILE_SIZE) {
      return false;
    }
    return true;
  };

  const checkFileType = type => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(type)) {
      return false;
    }
    return true;
  };

  let setForm = () => {};
  let form = {};
  let panelTitle = "";
  let buttonText = "";
  switch (formType) {
    case "edit": {
      setForm = setEdit;
      form = editPetitions;
      panelTitle = "Редактирование петиции";
      buttonText = "Сохранить";
      break;
    }

    case "create": {
      setForm = setCreate;
      form = createPetitions;
      panelTitle = "Создание петиции";
      buttonText = "Запустить";
      break;
    }

    default: {
      setForm = setCreate;
      form = createPetitions;
      panelTitle = "Создание петиции";
      buttonText = "Сохранить";
    }
  }

  const onChange = e => {
    const { name, value } = e.currentTarget;
    setForm({
      ...form,
      ...{
        [name]: value
          .replace(/[^[:print:]\s]/, "")
          .replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            ""
          )
      }
    });
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
        if (!checkFileSize(fileSize) || !checkFileType(file.type)) {
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
            placeholder="Введите название"
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
            pattern="\d*"
            value={form.need_signatures ? parseInt(form.need_signatures) : ""}
            onChange={onChange}
            placeholder="Введите количество подписей"
          />
          <p className="form__row_error__text">
            Можно собрать от 1 до 10 000 000 подписей
          </p>
        </Div>

        <Div
          className={`form__row ${
            form.directed_to && form.directed_to.length > 255
              ? "form__row_error"
              : ""
          }`}
        >
          <label htmlFor="need_signatures">Кому направлена петиция</label>
          <Input
            id="directed_to"
            name="directed_to"
            type="text"
            value={form.directed_to ? form.directed_to : ""}
            onChange={onChange}
            placeholder="Введите адресата"
          />
          <p className="form__row_error__text">Слишком много символов</p>
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
            placeholder="Введите текст"
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
          <label htmlFor="text" className="form__row__fix">
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

        <Div className="form__button">
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
                (!form.directed_to ||
                  (form.directed_to && form.directed_to.length <= 255))
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
                Object.entries(form).forEach(pair => {
                  if (
                    !pair[0].includes("preview") &&
                    initialEditPetitions[pair[0]] !== pair[1]
                  ) {
                    if (
                      ["file1", "file2"].includes(pair[0]) &&
                      form.file1_preview === form.file2_preview &&
                      !changed.get("file")
                    ) {
                      if (pair[1] === undefined) {
                        changed.append("file", "delete");
                      } else {
                        changed.append("file", pair[1], "img");
                      }
                    } else if (["file1", "file2"].includes(pair[0])) {
                      if (!changed.get(pair[0]) && !changed.get("file")) {
                        if (pair[1] === undefined) {
                          changed.append(pair[0], "delete");
                        } else {
                          changed.append(pair[0], pair[1], "img");
                        }
                      }
                    } else {
                      changed.append(pair[0], pair[1]);
                    }
                  }
                });
                Backend.request(`petitions/${form.id}`, changed, "PATCH")
                  .then(response => {
                    if (
                      launchParameters.vk_access_token_settings.includes(
                        "friends"
                      )
                    ) {
                      loadPetitions("petitions", true)
                        .then(response => {
                          setPopular(response.popular || []);
                          setLast(response.last || []);
                          setSigned(response.signed || []);
                          setManaged(response.managed || []);
                        })
                        .catch(() => {});
                    } else {
                      loadPetitions("petitions", false)
                        .then(response => {
                          setPopular(response.popular || []);
                          setLast(response.last || []);
                          setSigned(response.signed || []);
                          setManaged(response.managed || []);
                        })
                        .catch(() => {});
                    }
                    setFetchingStatus(false);
                    setTs({ time: Date.now(), message: "Изменения сохранены" });
                  })
                  .catch(({ message }) => {
                    setFetchingStatus(false);
                    setTs({ time: Date.now(), message });
                  });
                return;
              }

              const formData = new FormData();
              Object.entries(form).forEach(pair => {
                if (!pair[0].includes("preview")) {
                  if (
                    ["file1", "file2"].includes(pair[0]) &&
                    form.file2_preview === form.file1_preview &&
                    !formData.get("file")
                  ) {
                    formData.append("file", pair[1], "img");
                    formData.delete("file1");
                    formData.delete("file2");
                  } else if (["file1", "file2"].includes(pair[0])) {
                    if (!formData.get("file")) {
                      formData.append(pair[0], pair[1], "img");
                    }
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
                  // setManaged(
                  //   [
                  //     {
                  //       id: response.id,
                  //       title: response.title,
                  //       web_photo_url: response.web_photo_url,
                  //       count_signatures: response.count_signatures,
                  //       need_signatures: response.need_signatures
                  //     }
                  //   ].concat(managedPetitions)
                  // );
                  if (
                    launchParameters.vk_access_token_settings.includes(
                      "friends"
                    )
                  ) {
                    loadPetitions("petitions", true)
                      .then(response => {
                        setPopular(response.popular || []);
                        setLast(response.last || []);
                        setSigned(response.signed || []);
                        setManaged(response.managed || []);
                      })
                      .catch(() => {});
                  } else {
                    loadPetitions("petitions", false)
                      .then(response => {
                        setPopular(response.popular || []);
                        setLast(response.last || []);
                        setSigned(response.signed || []);
                        setManaged(response.managed || []);
                      })
                      .catch(() => {});
                  }
                  setFetchingStatus(false);
                  setCreate({
                    title: undefined,
                    text: undefined,
                    need_signatures: undefined,
                    directed_to: undefined,
                    file: undefined,
                    file1: undefined,
                    file1_preview: undefined,
                    file2: undefined,
                    file2_preview: undefined
                  });
                  setPage("done", "");
                })
                .catch(({ message }) => {
                  setFetchingStatus(false);
                  setTs({ time: Date.now(), message });
                });
            }}
          >
            {buttonText}
          </Button>
          <FadeInOut ts={ts.time}>
            <Gray>{ts.message}</Gray>
          </FadeInOut>
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
    launchParameters: state.data.launchParameters
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
        setManaged,
        setPopular,
        setLast,
        setSigned
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
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPetitionDesktop);

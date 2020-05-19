import React from "react";
import {
  Div,
  Button,
  FixedLayout,
  ScreenSpinner,
  Snackbar,
  Avatar
} from "@vkontakte/vkui";
import "./EditPetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import {
  goBack,
  openModal,
  openPopout,
  closePopout,
  setPage
} from "../../store/router/actions";
import {
  setCreate,
  setCurrent,
  setLast,
  setManaged,
  setPopular,
  setSigned
} from "../../store/petitions/actions";
import Backend from "../../tools/Backend";
import { loadPetitions } from "../../tools/helpers";

const api = new VKMiniAppAPI();

const EditPetitionTabbar = ({
  disabled,
  formType,
  editPetitions,
  initialEditPetitions,
  createPetitions,
  openPopout,
  closePopout,
  setSnackbar,
  setPage,
  activeView,
  setCurrent,
  setManaged,
  setCreate,
  setPopular,
  setLast,
  setSigned,
  launchParameters
}) => {
  return (
    <FixedLayout vertical="bottom" className="Tabbar EditPetitionTabbar">
      <Div>
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            openPopout(<ScreenSpinner />);
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
                  closePopout();
                  api.notificationOccurred("success").catch(() => {});
                  setSnackbar(
                    <Snackbar
                      layout="vertical"
                      onClose={() => setSnackbar()}
                      before={
                        <Avatar
                          size={24}
                          style={{
                            backgroundColor: "var(--dynamic_green)"
                          }}
                        >
                          <Icon24DoneOutline
                            fill="#fff"
                            width={14}
                            height={14}
                          />
                        </Avatar>
                      }
                    >
                      Изменения сохранены
                    </Snackbar>
                  );
                })
                .catch(({ message }) => {
                  closePopout();
                  api.notificationOccurred("success").catch(() => {});
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
                      {message}
                    </Snackbar>
                  );
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
                if (
                  launchParameters.vk_access_token_settings.includes("friends")
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
                closePopout();
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
                setPage(activeView, "done", false, true, ["done"]);
              })
              .catch(({ code, message }) => {
                closePopout();
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
                    {message}
                  </Snackbar>
                );
              });
          }}
          disabled={disabled}
        >
          {formType === "edit" ? "Сохранить" : "Запустить"}
        </Button>
      </Div>
    </FixedLayout>
  );
};

const mapStateToProps = state => {
  return {
    formType: state.petitions.formType,
    editPetitions: state.petitions.edit,
    initialEditPetitions: state.petitions.initialEdit,
    createPetitions: state.petitions.create,
    launchParameters: state.data.launchParameters,
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        goBack,
        setCreate,
        openModal,
        openPopout,
        closePopout,
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

EditPetitionTabbar.propTypes = {
  disabled: PropTypes.bool.isRequired,
  formType: PropTypes.string.isRequired,
  editPetitions: PropTypes.object.isRequired,
  initialEditPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setManaged: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  setPopular: PropTypes.func.isRequired,
  setLast: PropTypes.func.isRequired,
  setSigned: PropTypes.func.isRequired,
  launchParameters: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetitionTabbar);

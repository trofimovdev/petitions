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
  setManaged
} from "../../store/petitions/actions";
import Backend from "../../tools/Backend";

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
  managedPetitions,
  setCreate
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
            if (form.file_1 === form.file_2) {
              form.file = form.file_1;
              delete form.file_1;
              delete form.file_2;
            }
            if (formType === "edit") {
              const changed = {};
              for (const [key, value] of Object.entries(initialEditPetitions)) {
                if (form[key] === value) {
                  continue;
                }
                changed[key] = form[key];
                if (
                  ["file", "file_1", "file_2"].includes(key) &&
                  form[key] !== initialEditPetitions.file
                ) {
                  changed.images = true;
                }
              }
              Backend.request(
                `petitions/${form.id}`,
                { ...changed, type: "edit" },
                "PATCH"
              )
                .then(response => {
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
            Backend.request("petitions", { ...form, type: "create" }, "POST")
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
                      mobile_photo_url: response.mobile_photo_url,
                      count_signatures: response.count_signatures,
                      need_signatures: response.need_signatures
                    }
                  ].concat(managedPetitions)
                );
                closePopout();
                setCreate({
                  title: undefined,
                  text: undefined,
                  need_signatures: undefined,
                  directed_to: undefined,
                  file_1: undefined,
                  file_2: undefined
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
    activeView: state.router.activeView,
    managedPetitions: state.petitions.managed
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
        setManaged
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
  managedPetitions: PropTypes.array.isRequired,
  setCreate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetitionTabbar);

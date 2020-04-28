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
import {
  goBack,
  openModal,
  openPopout,
  closePopout,
  setPage
} from "../../store/router/actions";
import { setCreate, setEdit } from "../../store/petitions/actions";
import Backend from "../../tools/Backend";

const api = new VKMiniAppAPI();

const EditPetitionTabbar = ({
  disabled,
  formType,
  editPetitions,
  createPetitions,
  openPopout,
  closePopout,
  setSnackbar,
  setPage,
  activeView
}) => {
  return (
    <FixedLayout vertical="bottom" className="Tabbar EditPetitionTabbar">
      <Div>
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            api.notificationOccurred("success").catch(() => {});
            // openPopout(<ScreenSpinner />);
            console.log(formType, editPetitions, createPetitions);
            const form =
              formType === "edit"
                ? { ...editPetitions }
                : { ...createPetitions };
            if (form.file_1 === form.file_2) {
              console.log("THE SAME IMAGE");
              form.file = form.file_1;
              delete form.file_1;
              delete form.file_2;
            }
            Backend.request("petitions", { ...form, type: "create" }, "POST")
              .then(response => {
                closePopout();
                // setPage(activeView, "done");
              })
              .catch(() => {
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
                    Произошла ошибка
                  </Snackbar>
                );
              });
          }}
          disabled={disabled}
        >
          Запустить
        </Button>
      </Div>
    </FixedLayout>
  );
};

const mapStateToProps = state => {
  return {
    formType: state.petitions.formType,
    editPetitions: state.petitions.edit,
    createPetitions: state.petitions.create,
    activeView: state.router.activeView
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
        openModal,
        openPopout,
        closePopout,
        setPage
      },
      dispatch
    )
  };
};

EditPetitionTabbar.propTypes = {
  disabled: PropTypes.bool.isRequired,
  formType: PropTypes.string.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired,
  openPopout: PropTypes.func.isRequired,
  closePopout: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetitionTabbar);

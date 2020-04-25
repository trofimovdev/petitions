import React from "react";
import { Tabbar, Div, Button, FixedLayout } from "@vkontakte/vkui";
import Icon24ShareOutline from "@vkontakte/icons/dist/24/share_outline";
import Icon24Settings from "@vkontakte/icons/dist/24/settings";
import Icon24DoneOutline from "@vkontakte/icons/dist/24/done_outline";
import "./EditPetitionTabbar.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { goBack, openModal } from "../../store/router/actions";
import { setCreate, setEdit } from "../../store/petitions/actions";

const api = new VKMiniAppAPI();

const EditPetitionTabbar = ({
  disabled,
  formType,
  editPetitions,
  createPetitions
}) => {
  // console.log(form.title);
  // const { title, text, signatures, file_1, file_2 } = form;
  // console.log(form.title, title, form.text, text, form.title && form.text);
  return (
    <FixedLayout vertical="bottom" className="Tabbar EditPetitionTabbar">
      <Div>
        <Button
          size="xl"
          mode="primary"
          onClick={() => {
            api.notificationOccurred("success").catch(() => {});
            console.log(formType, editPetitions, createPetitions);
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

EditPetitionTabbar.propTypes = {
  disabled: PropTypes.bool.isRequired,
  formType: PropTypes.string.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPetitionTabbar);

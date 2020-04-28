import React from "react";
import {
  Panel,
  Placeholder,
  Link,
  FixedLayout,
  Button,
  Div,
  usePlatform
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon56CheckCircleOutline from "@vkontakte/icons/dist/56/check_circle_outline";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { goBack, openModal } from "../../store/router/actions";
import { setEdit, setCreate } from "../../store/petitions/actions";
import "./DonePetition.css";

const api = new VKMiniAppAPI();

const DonePetition = ({
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
  const platform = usePlatform();

  return (
    <Panel id={id} separator={false} className="DonePetition">
      <Placeholder
        icon={<Icon56CheckCircleOutline className="DonePetition__icon" />}
        stretched
      >
        Петиция{" "}
        <Link className="DonePetition__title">
          «Поместить Кобе Брайанта на новый логотип НБА»
        </Link>{" "}
        запущена
      </Placeholder>
      <FixedLayout vertical="bottom" className="DonePetition__fixed-layout">
        <Div className="DonePetition__buttons">
          <Button
            size="xl"
            mode="primary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              openModal("share-type");
            }}
          >
            Поделиться
          </Button>
          <Button
            size="xl"
            mode="secondary"
            onClick={() => {
              api.selectionChanged().catch(() => {});
              goBack();
            }}
          >
            Вернуться к списку петиций
          </Button>
        </Div>
      </FixedLayout>
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

DonePetition.propTypes = {
  id: PropTypes.string.isRequired,
  activePanel: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  formType: PropTypes.string,
  setEdit: PropTypes.func.isRequired,
  setCreate: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  editPetitions: PropTypes.object.isRequired,
  createPetitions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DonePetition);

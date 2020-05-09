import React from "react";
import { Placeholder, Link, FixedLayout } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import Icon56CheckCircleOutline from "@vkontakte/icons/dist/56/check_circle_outline";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setPage, openModal } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";

const DonePetitionDesktop = ({
  id,
  setPage,
  openModal,
  currentPetition,
  setCurrent,
  activeView
}) => {
  return (
    <div id={id} className="DonePetitionDesktop">
      <Placeholder
        icon={
          <Icon56CheckCircleOutline className="DonePetitionDesktop__icon" />
        }
        stretched
      >
        Петиция{" "}
        <Link
          className="DonePetitionDesktop__title"
          onClick={() => {
            setCurrent({ id: currentPetition.id });
            setPage("petition", "");
          }}
        >
          {`«${currentPetition.title}»`}
        </Link>{" "}
        запущена
      </Placeholder>
      <FixedLayout
        vertical="bottom"
        className="DonePetitionDesktop__fixed-layout"
      >
        <a
          className="DonePetitionDesktop__fixed-layout__link"
          onClick={() => {
            setPage("petitions", "");
          }}
        >
          Вернуться к списку петиций
        </a>
      </FixedLayout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current,
    activeView: state.router.activeView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setPage,
        setCurrent,
        openModal
      },
      dispatch
    )
  };
};

DonePetitionDesktop.propTypes = {
  id: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  currentPetition: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DonePetitionDesktop);

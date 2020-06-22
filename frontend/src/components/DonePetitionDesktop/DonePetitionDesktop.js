import React from "react";
import { Placeholder, Link, FixedLayout } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import Icon56CheckCircleOutline from "@vkontakte/icons/dist/56/check_circle_outline";
import { connect } from "react-redux";
import { setPage } from "../../store/router/actions";
import { setCurrent } from "../../store/petitions/actions";
import "./DonePetitionDesktop.css";

const DonePetitionDesktop = ({ id, setPage, currentPetition, setCurrent }) => {
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
            setCurrent({
              id: currentPetition.id,
              title: currentPetition.title
            });
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
        <div
          className="DonePetitionDesktop__fixed-layout__link"
          onClick={() => {
            setPage("petitions", "");
          }}
        >
          Вернуться к списку петиций
        </div>
      </FixedLayout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentPetition: state.petitions.current
  };
};

const mapDispatchToProps = {
  setPage,
  setCurrent
};

DonePetitionDesktop.propTypes = {
  id: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  currentPetition: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DonePetitionDesktop);

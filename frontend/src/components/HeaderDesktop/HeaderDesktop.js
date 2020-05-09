import React from "react";
import PropTypes from "prop-types";
import "./HeaderDesktop.css";
import Icon24BrowserBack from "@vkontakte/icons/dist/24/browser_back";

const HeaderDesktop = ({ title, goBack }) => {
  return (
    <div className="HeaderDesktop">
      <div className="HeaderDesktop__before" onClick={goBack}>
        <Icon24BrowserBack className="HeaderDesktop__before__icon" />
        Назад
      </div>
      <div className="HeaderDesktop__inner">{title}</div>
    </div>
  );
};

HeaderDesktop.propTypes = {
  title: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default HeaderDesktop;

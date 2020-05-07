import React from "react";
import PropTypes from "prop-types";
import "./HeaderDesktop.css";

const HeaderDesktop = ({ title }) => {
  return (
    <div className="HeaderDesktop">
      <div className="HeaderDesktop__inner">
        {title}
      </div>
      {/*{!!this.props.after && <div className="HeaderDesktop__after">{this.props.after}</div>}*/}
    </div>
  );
};

HeaderDesktop.propTypes = {
  title: PropTypes.string.isRequired
};

export default HeaderDesktop;

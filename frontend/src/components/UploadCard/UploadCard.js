import React from "react";
import { Div, Card, Link } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./UploadCard.css";

const UploadCard = ({
  id,
  title,
  onChange,
  icon,
  text,
  size,
  bottomText,
  img = null
}) => {
  return (
    <Div className={`UploadCard UploadCard__${size}`}>
      <p className="UploadCard__top FormLayout__row-top">{title}</p>
      <input
        type="file"
        id={`fileElem_${id}`}
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChange}
      />
      <label htmlFor={`fileElem_${id}`}>
        <Card size="l" className="UploadCard__card">
          <div className="UploadCard__card__content FormField__border">
            {img ? (
              <img src={img} />
            ) : (
              <>
                {icon}
                <Link className="UploadCard__card__content__text">{text}</Link>
              </>
            )}
          </div>
        </Card>
      </label>
      {bottomText && <p className="UploadCard__bottom">{bottomText}</p>}
    </Div>
  );
};

UploadCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  bottomText: PropTypes.string,
  img: PropTypes.string
};

export default UploadCard;

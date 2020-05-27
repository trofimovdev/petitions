import React from "react";
import { Div, Card, Link } from "@vkontakte/vkui";
import PropTypes from "prop-types";
import "./UploadCard.css";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";

const UploadCard = ({
  id,
  title,
  onChange,
  icon,
  text,
  size,
  bottomText,
  onCancel,
  img = null
}) => {
  return (
    <Div className={`UploadCard UploadCard__${size}`}>
      {title && <p className="UploadCard__top FormLayout__row-top">{title}</p>}
      {!img && (
        <input
          type="file"
          id={`file${id}`}
          accept="image/png,image/jpeg,image/jpg"
          style={{ display: "none" }}
          onChange={onChange}
        />
      )}
      <label htmlFor={`file${id}`}>
        <Card size="l" className="UploadCard__card">
          {img != null && (
            <div
              className="UploadCard__card__cancel-button"
              id={`file${id}`}
              onClick={onCancel}
            >
              <Icon16Cancel />
            </div>
          )}
          <div className="UploadCard__card__content ">
            {img ? (
              <img src={img} alt="petition" />
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
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  bottomText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  img: PropTypes.string
};

export default UploadCard;

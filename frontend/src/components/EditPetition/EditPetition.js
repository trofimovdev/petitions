import React from "react";
import {
  Panel,
  PanelHeaderButton,
  PanelHeaderSimple,
  FormLayout,
  Input,
  Div,
  Card,
  Textarea,
  Link
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import "./EditPetition.css";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Icon48Camera from "@vkontakte/icons/dist/48/camera";

const api = new VKMiniAppAPI();

const EditPetition = ({ id, activeStory, setStory, activePanel, setPage }) => {
  return (
    <Panel id={id} separator={false}>
      <PanelHeaderSimple
        left={
          <PanelHeaderButton
            onClick={() => {
              api.setLocationHash("feed").then(() => {
                setPage(activePanel, "feed");
              });
            }}
          >
            <Icon28ChevronBack />
          </PanelHeaderButton>
        }
      >
        Создание
      </PanelHeaderSimple>
      <FormLayout className="EditForm">
        <Input type="text" top="Название петиции" name="title" />
        <Textarea top="Текст петиции" />
        <Input
          type="number"
          top="Необходимое количество подписей"
          name="title"
        />
        <Div className="EditForm__card-wrapper">
          <p className="EditForm__card-wrapper__top FormLayout__row-top">
            Обложка для мобильной версии
          </p>
          <Card size="l" className="EditForm__card-wrapper__card">
            <div className="EditForm__card-wrapper__card__content FormField__border">
              <Icon48Camera />
              <Link className="EditForm__card-wrapper__card__content__text">Загрузить обложку</Link>
            </div>
          </Card>
        </Div>
      </FormLayout>
    </Panel>
  );
};

EditPetition.propTypes = {
  id: PropTypes.string.isRequired,
  activeStory: PropTypes.string.isRequired,
  setStory: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
};

export default EditPetition;

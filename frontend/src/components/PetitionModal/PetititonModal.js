import React from "react";
import {
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Button,
  Div,
  List,
  Cell,
  Search,
  FixedLayout,
  Avatar,
  ANDROID,
  IOS,
  usePlatform
} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import Icon28StoryOutline from "@vkontakte/icons/dist/28/story_outline";
import Icon28ArrowUturnRightOutline from "@vkontakte/icons/dist/28/arrow_uturn_right_outline";
import Icon28ChainOutline from "@vkontakte/icons/dist/28/chain_outline";
import "./PetitionModal.css";
import PropTypes from "prop-types";

const PetitionModal = ({ activeModal, closeModal }) => {
  const platform = usePlatform();
  return (
    <ModalRoot activeModal={activeModal} onClose={closeModal}>
      <ModalPage
        id="share-type"
        onClose={closeModal}
        header={
          <ModalPageHeader
            left={
              platform === ANDROID && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              )
            }
            right={
              platform === IOS && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
          >
            Поделиться
          </ModalPageHeader>
        }
      >
        <Div className="PetitionModal">
          <div className="PetitionModal__button-wrapper">
            <Button
              mode="secondary"
              style={{ width: "76px", height: "52px", borderRadius: "26px" }}
            >
              <Icon28StoryOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">В истории</p>
          </div>

          <div className="PetitionModal__button-wrapper">
            <Button
              mode="secondary"
              style={{ width: "76px", height: "52px", borderRadius: "26px" }}
            >
              <Icon28ArrowUturnRightOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">
              На своей странице
            </p>
          </div>

          <div className="PetitionModal__button-wrapper">
            <Button
              mode="secondary"
              style={{ width: "76px", height: "52px", borderRadius: "26px" }}
            >
              <Icon28ChainOutline />
            </Button>
            <p className="PetitionModal__button-wrapper__text">
              Скопировать ссылку
            </p>
          </div>
        </Div>
      </ModalPage>

      <ModalPage
        id="select-users"
        onClose={closeModal}
        header={
          <ModalPageHeader
            left={
              platform === ANDROID && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              )
            }
            right={
              platform === IOS && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
          >
            Выберите пользователей
          </ModalPageHeader>
        }
      >
        <FixedLayout vertical="top">
          <Search
            value=""
            onChange={e => {
              console.log(e);
            }}
            after={null}
          />
        </FixedLayout>
        <List>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Артур Стамбульцян
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Тимофей Чаптыков
          </Cell>
          <Cell selectable before={<Avatar size={40} src="" />}>
            Влад Анесов
          </Cell>
        </List>
      </ModalPage>
    </ModalRoot>
  );
};

PetitionModal.propTypes = {
  activeModal: PropTypes.string,
  closeModal: PropTypes.func.isRequired
};

export default PetitionModal;

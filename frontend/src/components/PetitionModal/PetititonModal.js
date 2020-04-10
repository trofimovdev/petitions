import React, { useState } from "react";
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
  usePlatform,
  getClassName,
  Placeholder
} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import Icon28StoryOutline from "@vkontakte/icons/dist/28/story_outline";
import Icon28ArrowUturnRightOutline from "@vkontakte/icons/dist/28/arrow_uturn_right_outline";
import Icon28ChainOutline from "@vkontakte/icons/dist/28/chain_outline";
import "./PetitionModal.css";
import PropTypes from "prop-types";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";

const api = new VKMiniAppAPI();

const PetitionModal = ({ activeModal, closeModal }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const searchUsers = e => {
    // console.log(e.currentTarget.value);
    api
      .callAPIMethod("users.search", {
        q: "durov",
        fields: "photo_50",
        access_token:
          "ecba06da02faea12cd315ad3ba07d548fd53ca64ebca481edc5f716496b0af9f2356cd7a7ef66bc9d1f50",
        v: "5.103"
      })
      .then(r => {
        console.log("response", r);
      });

    // TODO: вынести в константы
    // api.getAccessToken(7338958, "friends").then(r => {
    //   console.log(r);
    // });
  };

  const getAccessToken = e => {
    api.getAccessToken(7338958, "").then(r => {
      console.log(r);
    });
  };

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
        className="SelectUsers"
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
        <FixedLayout vertical="top" className="SelectUsers__search">
          <Search
            // value=""
            onChange={searchUsers}
            after={null}
          />
        </FixedLayout>
        <List className="SelectUsers__list">
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Выбранный Юзер 3
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Выбранный Юзер 2
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Выбранный Юзер 1
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
          <Cell
            selectable
            before={
              <Avatar
                size={40}
                src="https://sun9-13.userapi.com/c836333/v836333001/31193/dNxZpRF-z_M.jpg?ava=1"
              />
            }
          >
            Павел Дуров
          </Cell>
        </List>

         {/*<Placeholder */}
         {/* className="SelectUsers__placeholder"*/}
         {/* action={ */}
         {/*   <Button */}
         {/*     size="l" */}
         {/*     onClick={() => { */}
         {/*       api.selectionChanged().catch(() => {}); */}
         {/*       // getAccessToken(); */}
         {/*       searchUsers(); */}
         {/*     }} */}
         {/*   > */}
         {/*     Предоставить доступ */}
         {/*   </Button> */}
         {/* } */}
         {/*> */}
         {/* Чтобы отмечать друзей и других людей в петиции, необходимо предоставить доступ к их списку */}
         {/*</Placeholder>*/}
      </ModalPage>
    </ModalRoot>
  );
};

PetitionModal.propTypes = {
  activeModal: PropTypes.string,
  closeModal: PropTypes.func.isRequired
};

export default PetitionModal;

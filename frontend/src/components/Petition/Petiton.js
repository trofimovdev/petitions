import React, { useEffect, useState } from "react";
import {
  Panel,
  PanelHeaderSimple,
  PanelHeaderButton,
  Separator,
  Div,
  UsersStack,
  Avatar,
  Cell,
  Link,
  PullToRefresh,
  getClassName,
  usePlatform
} from "@vkontakte/vkui";
import "./Petition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import PropTypes from "prop-types";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import PetitionTabbar from "../PetitionTabbar/PetitionTabbar";

const api = new VKMiniAppAPI();

const Petition = ({ id, goBack, activeView, openModal, currentPetition, activePanel }) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [headerStatus, setHeaderStatus] = useState("hidden");
  console.log("CURRENT PETITION is", currentPetition);

  const onRefresh = () => {
    console.log("refresh");
    setFetchingStatus(true);
    setTimeout(function() {
      setFetchingStatus(false);
    }, 1000);
  };

  const onScroll = () => {
    const scrollPosition = window.scrollY;
    console.log(scrollPosition);
    if (scrollPosition > 128) {
      setHeaderStatus("shown");
    } else {
      setHeaderStatus("hidden");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, [currentPetition]);

  if (activePanel === "petition") {
    api.setLocationHash(`p${currentPetition.id.toString()}`);
  }

  const platform = usePlatform();

  return (
    <Panel id={id} separator={false} className="Petition">
      <PanelHeaderSimple
        className={`Petition__header Petition__header__${headerStatus}`}
        left={
          <PanelHeaderButton
            onClick={() => {
              goBack();
            }}
          >
            <Icon28ChevronBack />
          </PanelHeaderButton>
        }
        separator={false}
      />

      <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
        <div className="Petition__image">
          <img src={`${currentPetition.mobile_photo_url}`} />
        </div>
        <Div className={getClassName("Petition__info", platform)}>
          <h1>{currentPetition.title}</h1>
          <PetitionProgress
            numberOfSignatures={currentPetition.count_signatures}
            totalSignatures={currentPetition.need_signatures}
          />
          {/* <UsersStack */}
          {/*  className="Petition__users_stack" */}
          {/*  photos={[ */}
          {/*    "https://sun9-6.userapi.com/c846121/v846121540/195e4d/17NeSTKMR1o.jpg?ava=1", */}
          {/*    "https://sun9-30.userapi.com/c845017/v845017447/1773bb/Wyfyi8-7e5A.jpg?ava=1", */}
          {/*    "https://sun9-25.userapi.com/c849432/v849432217/18ad61/0UFtoEhCsgA.jpg?ava=1" */}
          {/*  ]} */}
          {/* > */}
          {/*  Подписали Дмитрий, Анастасия и еще 12 друзей */}
          {/* </UsersStack> */}
        </Div>
        <Separator />
        <Div className="Petition__text">{currentPetition.text}</Div>
        <Separator />
        <Cell
          className="Petition__creator"
          before={<Avatar src={currentPetition.owner.photo_50} size={40} />}
          multiline
        >
          <Link
            href={`https://vk.com/id${currentPetition.owner_id}`}
            className="Petition__creator__link"
          >
            {currentPetition.owner.first_name} {currentPetition.owner.last_name}
          </Link>
          создал петицию, адресованную Сергею Корнееву
        </Cell>
      </PullToRefresh>
      {/* </Touch> */}
      <PetitionTabbar openModal={openModal} />
    </Panel>
  );
};

Petition.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  currentPetition: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired
};

export default Petition;

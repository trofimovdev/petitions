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
import test from "../../img/test.jpg";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import PetitionTabbar from "../PetitionTabbar/PetitionTabbar";

const api = new VKMiniAppAPI();

const Petition = ({ id, setPage, activePanel, openModal }) => {
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const [headerStatus, setHeaderStatus] = useState("hidden");

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
  });

  const platform = usePlatform();

  return (
    <Panel id={id} separator={false} className="Petition">
      <PanelHeaderSimple
        className={`Petition__header Petition__header__${headerStatus}`}
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
        separator={false}
      />

      <PullToRefresh onRefresh={onRefresh} isFetching={fetchingStatus}>
        <div className="Petition__image">
          <img src={`${test}`} />
        </div>
        <Div className={getClassName("Petition__info", platform)}>
          <h1>Поместить Кобе Брайанта на новый логотип НБА</h1>
          <PetitionProgress numberOfSignatures={100} totalSignatures={200} />
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
        <Div className="Petition__text">
          В связи с преждевременным и неожиданным уходом великого Кобе Брайанта,
          пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
          новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
          баскетболист, выступавший в Национальной баскетбольной ассоциации в
          течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс».
          Играл на позиции атакующего защитника. Известен своей
          сверхрезультативной игрой.В связи с преждевременным и неожиданным
          уходом великого Кобе Брайанта, пожалуйста, подпишите эту петицию,
          чтобы увековечить его навсегда на новом логотипе НБА. Ко́би Бин Бра́йант
          — американский профессиональный баскетболист, выступавший в
          Национальной баскетбольной ассоциации в течение двадцати сезонов за
          одну команду, «Лос-Анджелес Лейкерс». Играл на позиции атакующего
          защитника. Известен своей сверхрезультативной игрой.В связи с
          преждевременным и неожиданным уходом великого Кобе Брайанта,
          пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
          новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
          баскетболист, выступавший в Национальной баскетбольной ассоциации в
          течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс».
          Играл на позиции атакующего защитника. Известен своей
          сверхрезультативной игрой.В связи с преждевременным и неожиданным
          уходом великого Кобе Брайанта, пожалуйста, подпишите эту петицию,
          чтобы увековечить его навсегда на новом логотипе НБА. Ко́би Бин Бра́йант
          — американский профессиональный баскетболист, выступавший в
          Национальной баскетбольной ассоциации в течение двадцати сезонов за
          одну команду, «Лос-Анджелес Лейкерс». Играл на позиции атакующего
          защитника. Известен своей сверхрезультативной игрой.В связи с
          преждевременным и неожиданным уходом великого Кобе Брайанта,
          пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
          новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
          баскетболист, выступавший в Национальной баскетбольной ассоциации в
          течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс».
          Играл на позиции атакующего защитника. Известен своей
          сверхрезультативной игрой.В связи с преждевременным и неожиданным
          уходом великого Кобе Брайанта, пожалуйста, подпишите эту петицию,
          чтобы увековечить его навсегда на новом логотипе НБА. Ко́би Бин Бра́йант
          — американский профессиональный баскетболист, выступавший в
          Национальной баскетбольной ассоциации в течение двадцати сезонов за
          одну команду, «Лос-Анджелес Лейкерс». Играл на позиции атакующего
          защитника. Известен своей сверхрезультативной игрой.В связи с
          преждевременным и неожиданным уходом великого Кобе Брайанта,
          пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
          новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
          баскетболист, выступавший в Национальной баскетбольной ассоциации в
          течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс».
          Играл на позиции атакующего защитника. Известен своей
          сверхрезультативной игрой.В связи с преждевременным и неожиданным
          уходом великого Кобе Брайанта, пожалуйста, подпишите эту петицию,
          чтобы увековечить его навсегда на новом логотипе НБА. Ко́би Бин Бра́йант
          — американский профессиональный баскетболист, выступавший в
          Национальной баскетбольной ассоциации в течение двадцати сезонов за
          одну команду, «Лос-Анджелес Лейкерс». Играл на позиции атакующего
          защитника. Известен своей сверхрезультативной игрой.В связи с
          преждевременным и неожиданным уходом великого Кобе Брайанта,
          пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
          новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
          баскетболист, выступавший в Национальной баскетбольной ассоциации в
          течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс».
          Играл на позиции атакующего защитника. Известен своей
          сверхрезультативной игрой.В связи с преждевременным и неожиданным
          уходом великого Кобе Брайанта, пожалуйста, подпишите эту петицию,
          чтобы увековечить его навсегда на новом логотипе НБА. Ко́би Бин Бра́йант
          — американский профессиональный баскетболист, выступавший в
          Национальной баскетбольной ассоциации в течение двадцати сезонов за
          одну команду, «Лос-Анджелес Лейкерс». Играл на позиции атакующего
          защитника. Известен своей сверхрезультативной игрой.В связи с
          преждевременным и неожиданным уходом великого Кобе Брайанта,
          пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
          новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
          баскетболист, выступавший в Национальной баскетбольной ассоциации в
          течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс».
          Играл на позиции атакующего защитника. Известен своей
          сверхрезультативной игрой.В связи с преждевременным и неожиданным
          уходом великого Кобе Брайанта, пожалуйста, подпишите эту петицию,
          чтобы увековечить его навсегда на новом логотипе НБА. Ко́би Бин Бра́йант
          — американский профессиональный баскетболист, выступавший в
          Национальной баскетбольной ассоциации в течение двадцати сезонов за
          одну команду, «Лос-Анджелес Лейкерс». Играл на позиции атакующего
          защитника. Известен своей сверхрезультативной игрой.
        </Div>
        <Separator />
        <Cell
          className="Petition__creator"
          before={
            <Avatar
              src="https://sun9-30.userapi.com/c845017/v845017447/1773bb/Wyfyi8-7e5A.jpg?ava=1"
              size={40}
            />
          }
          multiline
        >
          <Link
            href="https://vk.com/id165275777"
            className="Petition__creator__link"
          >
            Роман Соколов
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
  setPage: PropTypes.func.isRequired,
  activePanel: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired
};

export default Petition;

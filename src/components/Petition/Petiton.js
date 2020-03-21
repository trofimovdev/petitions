import React from "react";
import {
  Panel,
  PanelHeaderSimple,
  PanelHeaderButton,
  Separator,
  Div,
  FixedLayout,
  UsersStack,
  Avatar,
  Cell,
  Link
} from "@vkontakte/vkui";
import "./Petition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import test from "../../img/test.jpg";
import PetitionProgress from "../PetitionProgress/PetitionProgress";
import PetitionTabbar from "../PetitionTabbar/PetitionTabbar";

const Petition = ({ id }) => {
  return (
    <Panel id={id} separator={false} className="Petition">
      <PanelHeaderSimple
        className="Petition__header"
        left={
          <PanelHeaderButton>
            <Icon28ChevronBack />
          </PanelHeaderButton>
        }
        separator={false}
      />

      <div className="test">
        <img src={`${test}`} />
      </div>
      <Div className="Petition__info">
        <h1>Поместить Кобе Брайанта на новый логотип НБА</h1>
        <PetitionProgress numberOfSignatures={100} totalSignatures={200} />
        <UsersStack
          className="PetitionCard__users_stack"
          photos={[
            "https://sun9-6.userapi.com/c846121/v846121540/195e4d/17NeSTKMR1o.jpg?ava=1",
            "https://sun9-30.userapi.com/c845017/v845017447/1773bb/Wyfyi8-7e5A.jpg?ava=1",
            "https://sun9-25.userapi.com/c849432/v849432217/18ad61/0UFtoEhCsgA.jpg?ava=1"
          ]}
        >
          Подписали Дмитрий, Анастасия и еще 12 друзей
        </UsersStack>
      </Div>
      <Separator />
      <Div className="Petition__text">
        В связи с преждевременным и неожиданным уходом великого Кобе Брайанта,
        пожалуйста, подпишите эту петицию, чтобы увековечить его навсегда на
        новом логотипе НБА. Ко́би Бин Бра́йант — американский профессиональный
        баскетболист, выступавший в Национальной баскетбольной ассоциации в
        течение двадцати сезонов за одну команду, «Лос-Анджелес Лейкерс». Играл
        на позиции атакующего защитника. Известен своей сверхрезультативной
        игрой.
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
        </Link>{" "}
        создал петицию, адресованную Сергею Корнееву
      </Cell>

      <PetitionTabbar />
    </Panel>
  );
};

export default Petition;

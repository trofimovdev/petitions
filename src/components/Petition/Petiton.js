import React from "react";
import {
  Panel,
  PanelHeaderSimple,
  PanelHeaderButton,
  PullToRefresh
} from "@vkontakte/vkui";
import "./Petition.css";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import test from "../../img/test.jpg";

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
      <PullToRefresh onRefresh={null} isFetching={false}>
        <p>
          asdasdassdsdbfjkhsdsfgajhgsadkjhfsgadkjfhsgkhgasfdjkhasfgdjhsfksfda
        </p>
      </PullToRefresh>
    </Panel>
  );
};

export default Petition;

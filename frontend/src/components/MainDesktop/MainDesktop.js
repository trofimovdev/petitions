import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TabList, TabItem, Link } from "@happysanta/vk-app-ui";
import { Spinner } from "@vkontakte/vkui";
import Icon24Add from "@vkontakte/icons/dist/16/add";
import "./MainDesktop.css";
import FriendsCard from "../FriendsCard/FriendsCard";
import PetitionCardDesktop from "../PetitionCardDesktop/PetitionCardDesktop";

const MainDesktop = ({ id }) => {
  return (
    <div id={id} className="DesktopContainer">
      <TabList
        after={
          <Link className="create">
            <Icon24Add className="create__icon" />
            Создать петицию
          </Link>
        }
        activeTabId="main"
      >
        <TabItem selected>Популярные</TabItem>
        <TabItem>Последние</TabItem>
        <TabItem>Подписанные</TabItem>
        <TabItem>Мои петиции</TabItem>
      </TabList>
      <div className="wrapper">
      {/*<Spinner />*/}
        <FriendsCard />
        <>
          <PetitionCardDesktop
            id={0}
            title="Канье в президенты 2024"
            countSignatures={200000}
            needSignatures={150000}
          />
        </>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  };
};

MainDesktop.propTypes = {
  id: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MainDesktop);

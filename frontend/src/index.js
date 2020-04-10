import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import store from "./store";
import "./style/index.css";
import App from "./App";
import { setActiveTab, setStory } from "./store/router/actions";
import setColorScheme from "./store/ui/actions";
import Backend from "./tools/Backend";
import { setPopular, setLast, setSigned } from "./store/petitions/actions";

const api = new VKMiniAppAPI();

api.initApp();
api.onUpdateConfig(({ scheme }) => {
  store.dispatch(setColorScheme(scheme));
  console.log("SET COLOR SCHEME", scheme);
});

api.getAccessToken(7338958, "").then(r => {
  console.log(r);
});

Backend.request("bootstrap", {})
  .then(response => {
    store.dispatch(setPopular(response.popular || []));
    store.dispatch(setLast(response.last || []));
    store.dispatch(setSigned(response.signed || []));

    const screenHeight = document.body.getBoundingClientRect().height;
    if (313 * response.last.length < screenHeight) {
      // 313 - высота одной карточки с отступами в px
      console.log("НУЖНА ДОГРУЗКА");
    }
  })
  .catch(e => {
    console.log(e);
  });

store.dispatch(setStory("petitions", "feed"));
store.dispatch(setActiveTab("feed", "last"));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

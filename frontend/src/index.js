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
import { setColorScheme } from "./store/ui/actions";
import { loadPetitionCards } from "./tools/helpers";
import { setPopular, setLast, setSigned, setManaged } from "./store/petitions/actions";
import { setLaunchParameters } from "./store/data/actions";

const api = new VKMiniAppAPI();

const onLoad = response => {
  store.dispatch(setPopular(response.popular || []));
  store.dispatch(setLast(response.last || []));
  store.dispatch(setSigned(response.signed || []));
  store.dispatch(setManaged(response.managed || []));

  const screenHeight = document.body.getBoundingClientRect().height;
  if (313 * response.last.length < screenHeight) {
    // 313 - высота одной карточки в px (с отступами)
    console.log("НУЖНА ДОГРУЗКА");
  }
};

api.initApp();
api.onUpdateConfig(({ scheme }) => {
  store.dispatch(setColorScheme(scheme));
});

const launchParameters = new URLSearchParams(window.location.search);
store.dispatch(setLaunchParameters(Object.fromEntries(launchParameters)));
store.dispatch(setStory("petitions", "splashscreen", false));
store.dispatch(setActiveTab("feed", "last"));

if (launchParameters.get("vk_access_token_settings").includes("friends")) {
  console.log("with friends");
  loadPetitionCards("bootstrap", true)
    .then(r => onLoad(r))
    .catch(e => console.log(e));
} else {
  console.log("without friends");
  loadPetitionCards("bootstrap", false)
    .then(r => {
      console.log(r);
      onLoad(r);
    })
    .catch(e => console.log(e));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

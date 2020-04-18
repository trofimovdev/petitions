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
import { loadPetitions } from "./tools/helpers";
import {
  setPopular,
  setLast,
  setSigned,
  setManaged,
  setCurrent
} from "./store/petitions/actions";
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

const petitionRegExp = new RegExp("^#p\\d+$");
const feedRegExp = new RegExp("^#(popular|last|signed)$");
const managementRegExp = new RegExp("^#management$");
if (window.location.hash) {
  console.log("HASH", window.location.hash);
  const petitionId = window.location.hash.match(petitionRegExp);
  const feedTab = window.location.hash.match(feedRegExp);
  const management = window.location.hash.match(managementRegExp);
  if (petitionId) {
    setCurrent({ id: petitionId[1] });
  }
  if (feedTab) {
    console.log("SET ACTIVE TAB", feedTab);
    store.dispatch(setStory("petitions", "feed"));
    store.dispatch(setActiveTab("feed", feedTab[1]));
  }
  if (management) {
    store.dispatch(setStory("management", "feed"));
  }
} else {
  let isAppUser = false;
  api.storageGet("is_app_user").then(r => {
    isAppUser = r;
    console.log("is_app_user", r);
  });
  if (isAppUser) {
    store.dispatch(setStory("petitions", "feed"));
  } else {
    store.dispatch(setStory("petitions", "splashscreen", false));
  }
  store.dispatch(setActiveTab("feed", "last"));
}

const launchParameters = new URLSearchParams(window.location.search);
store.dispatch(setLaunchParameters(Object.fromEntries(launchParameters)));
if (launchParameters.get("vk_access_token_settings").includes("friends")) {
  console.log("with friends");
  loadPetitions("bootstrap", true)
    .then(r => onLoad(r))
    .catch(e => console.log(e));
} else {
  console.log("without friends");
  loadPetitions("bootstrap", false)
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

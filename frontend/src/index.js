import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import store from "./store";
import "./style/index.css";
import App from "./App";
import { setActiveTab, setStory, setPage } from "./store/router/actions";
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
  console.log("INDEX RESPONSE", response);
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

let isAppUser = false;
api.storageGet("is_app_user").then(r => {
  isAppUser = r;
  console.log("is_app_user", r);
});

const petitionRegExp = new RegExp("^#p(\\d+)$");
const feedRegExp = new RegExp("^#(popular|last|signed)$");
const managementRegExp = new RegExp("^#management$");
let petitionId = window.location.hash.match(petitionRegExp);
const feedTab = window.location.hash.match(feedRegExp);
const management = window.location.hash.match(managementRegExp);

console.log(
  "WINDOWS HASH",
  window.location.hash,
  petitionId,
  feedTab,
  management
);

const launchParameters = Object.fromEntries(
  new URLSearchParams(window.location.search)
);
store.dispatch(setLaunchParameters(launchParameters));
console.log("LAUNCH PARAMS", launchParameters);
if (launchParameters.vk_access_token_settings.includes("friends")) {
  console.log("with friends");
  loadPetitions("petitions", true)
    .then(r => onLoad(r))
    .catch(e => console.log(e));
} else {
  console.log("without friends");
  loadPetitions("petitions", false)
    .then(r => onLoad(r))
    .catch(e => console.log(e));
}

if (launchParameters.vk_ref.startsWith("story") && !petitionId) {
  const context = atob(launchParameters.vk_ref.split("_")[4]).match(
    petitionRegExp
  );
  console.log(
    "Context",
    launchParameters.vk_ref.split("_"),
    atob(launchParameters.vk_ref.split("_")[4]),
    context
  );
  if (context) {
    petitionId = context;
    console.log("SET PETITITON FROM STORY", petitionId);
  }
}
if (petitionId) {
  console.log("petitionId", petitionId);
  store.dispatch(setCurrent({ id: petitionId[1] }));
  store.dispatch(setActiveTab("feed", "last"));
  store.dispatch(setStory("petitions", "feed"));
  store.dispatch(setPage("petitions", "petition"));
} else if (!isAppUser) {
  console.log("!isAppUser");
  if (feedTab) {
    console.log("feedTab");
    store.dispatch(setStory("petitions", "splashscreen", false));
    store.dispatch(setActiveTab("feed", feedTab[1]));
  } else if (management) {
    console.log("management");
    store.dispatch(setStory("management", "splashscreen", false));
    store.dispatch(setActiveTab("feed", "last"));
  } else {
    store.dispatch(setStory("petitions", "splashscreen", false));
    store.dispatch(setActiveTab("feed", "last"));
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

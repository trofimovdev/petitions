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
  console.log("onload", response);
  store.dispatch(setPopular(response.popular || []));
  store.dispatch(setLast(response.last || []));
  store.dispatch(setSigned(response.signed || []));
  store.dispatch(setManaged(response.managed || []));
};

api.initApp();
api.onUpdateConfig(({ scheme }) => {
  store.dispatch(setColorScheme(scheme));
});

let isAppUser = false;
api
  .storageGet("is_apap_user")
  .then(r => {
    console.log("is_app_user", r);
    isAppUser = r;
    if (!isAppUser) {
      api.storageSet("is_app_user", "1");
    }

    const petitionRegExp = new RegExp("^#p(\\d+)$");
    const feedRegExp = new RegExp("^#(popular|last|signed)$");
    const managedRegExp = new RegExp("^#managed");
    let petitionId = window.location.hash.match(petitionRegExp);
    const feedTab = window.location.hash.match(feedRegExp);
    const managed = window.location.hash.match(managedRegExp);
    const launchParameters = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    store.dispatch(setLaunchParameters(launchParameters));
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      loadPetitions("petitions", true)
        .then(r => onLoad(r))
        .catch(() => {});
    } else {
      loadPetitions("petitions", false)
        .then(r => onLoad(r))
        .catch(() => {});
    }

    if (launchParameters.vk_ref.startsWith("story") && !petitionId) {
      const context = atob(launchParameters.vk_ref.split("_")[4]).match(
        petitionRegExp
      );
      if (context) {
        petitionId = context;
      }
    }
    if (petitionId) {
      console.log("petitionId", petitionId);
      store.dispatch(setCurrent({ id: petitionId[1] }));
      store.dispatch(setActiveTab("feed", "last"));
      store.dispatch(setStory("petitions", "feed"));
      if (launchParameters.vk_platform === "desktop_web") {
        store.dispatch(setPage("petition", ""));
      } else {
        store.dispatch(setPage("petitions", "petition"));
      }
    } else if (!isAppUser) {
      if (feedTab) {
        store.dispatch(setActiveTab("feed", feedTab[1]));
        if (launchParameters.vk_platform === "desktop_web") {
          store.dispatch(setPage("splashscreen", ""));
        } else {
          store.dispatch(setStory("petitions", "splashscreen", false));
        }
      } else if (managed) {
        store.dispatch(setActiveTab("feed", "last"));
        if (launchParameters.vk_platform === "desktop_web") {
          store.dispatch(setPage("splashscreen", ""));
        } else {
          store.dispatch(setStory("management", "splashscreen", false));
        }
      } else {
        store.dispatch(setActiveTab("feed", "last"));
        if (launchParameters.vk_platform === "desktop_web") {
          store.dispatch(setPage("splashscreen", ""));
        } else {
          store.dispatch(setStory("petitions", "splashscreen", false));
        }
      }
    } else if (feedTab) {
      store.dispatch(setActiveTab("feed", feedTab[1]));
      store.dispatch(setStory("petitions", "feed"));
    } else if (managed) {
      if (launchParameters.vk_platform === "desktop_web") {
        store.dispatch(setActiveTab("feed", "managed"));
        store.dispatch(setStory("petitions", ""));
      } else {
        store.dispatch(setActiveTab("feed", "last"));
        store.dispatch(setStory("management", "feed"));
      }
    } else {
      store.dispatch(setActiveTab("feed", "last"));
      store.dispatch(setStory("petitions", "feed"));
    }
  })
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
  });

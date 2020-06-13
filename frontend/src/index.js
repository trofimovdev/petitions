import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import bridge from "@vkontakte/vk-bridge";
import store from "./store";
import "./style/index.css";
import App from "./App";
import {
  setActiveTab,
  setStory,
  setPage
} from "./store/router/actions";
import { setColorScheme } from "./store/ui/actions";
import { loadPetitions, isDevEnv, storeGoBack } from "./tools/helpers";
import {
  setPopular,
  setLast,
  setSigned,
  setManaged,
  setCurrent
} from "./store/petitions/actions";
import {
  setInitError,
  setLaunchParameters,
  setOnline,
  setAppID
} from "./store/data/actions";

const api = new VKMiniAppAPI();

const onLoad = response => {
  store.dispatch(setPopular(response.popular || []));
  store.dispatch(setLast(response.last || []));
  store.dispatch(setSigned(response.signed || []));
  store.dispatch(setManaged(response.managed || []));
};

const initPetitions = launchParameters => {
  return new Promise((resolve, reject) => {
    if (launchParameters.vk_access_token_settings.includes("friends")) {
      loadPetitions("petitions", true)
        .then(r => {
          onLoad(r);
          resolve();
        })
        .catch(e => {
          store.dispatch(setInitError(true));
          reject();
        });
    } else {
      loadPetitions("petitions", false)
        .then(r => {
          onLoad(r);
          resolve();
        })
        .catch(e => {
          store.dispatch(setInitError(true));
          reject();
        });
    }
  });
};

if (isDevEnv()) {
  store.dispatch(setAppID(7338958));
} else {
  store.dispatch(setAppID(7442034));
}

api.onUpdateConfig(({ scheme }) => {
  store.dispatch(setColorScheme(scheme));
  setTimeout(() => {
    switch (scheme) {
      case "space_gray":
        bridge
          .send("VKWebAppSetViewSettings", {
            status_bar_style: "light",
            action_bar_color: "#19191a"
          })
          .catch(() => {});
        break;

      default:
      case "bright_light":
        bridge
          .send("VKWebAppSetViewSettings", {
            status_bar_style: "dark",
            action_bar_color: "#fff"
          })
          .catch(() => {});
        break;
    }
  }, 1000);
});

window.addEventListener("popstate", storeGoBack);
window.addEventListener("offline", () => {
  store.dispatch(setOnline(false));
  store.dispatch(setStory("petitions", "internet", false));
});
window.addEventListener("online", () => {
  store.dispatch(setOnline(true));
});

api.initApp();

let isAppUser = false;
api
  .storageGet("is_app_user")
  .then(isAppUser_response => {
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

    isAppUser = isAppUser_response;
    if (!isAppUser) {
      api.storageSet("is_app_user", "1");
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
      store.dispatch(setActiveTab("feed", "last"));
      if (launchParameters.vk_platform === "desktop_web") {
        store.dispatch(setCurrent({ id: petitionId[1] }));
        store.dispatch(setPage("petition", ""));
      } else {
        store.dispatch(setStory("petitions", "feed"));
        store.dispatch(setPage("petitions", "petition"));
        initPetitions(launchParameters)
          .then(() => {
            store.dispatch(setCurrent({ id: petitionId[1] }));
          })
          .catch(() => {
            store.dispatch(setPage("petitions", "feed"));
            store.dispatch(setInitError(true));
          });
        return;
      }
    } else if (!isAppUser) {
      if (feedTab) {
        if (launchParameters.vk_group_id) {
          store.dispatch(setActiveTab("feed", "last"));
        } else {
          store.dispatch(setActiveTab("feed", feedTab[1]));
        }
        if (launchParameters.vk_platform === "desktop_web") {
          store.dispatch(setPage("splashscreen", ""));
        } else {
          store.dispatch(setStory("petitions", "splashscreen"));
        }
      } else if (managed) {
        store.dispatch(setActiveTab("feed", "last"));
        if (launchParameters.vk_platform === "desktop_web") {
          store.dispatch(setPage("splashscreen", ""));
        } else if (
          ["moder", "editor", "admin"].includes(
            launchParameters.vk_viewer_group_role
          )
        ) {
          store.dispatch(setStory("management", "splashscreen"));
        } else {
          store.dispatch(setStory("petitions", "splashscreen"));
        }
      } else {
        store.dispatch(setActiveTab("feed", "last"));
        if (launchParameters.vk_platform === "desktop_web") {
          store.dispatch(setPage("splashscreen", ""));
        } else {
          store.dispatch(setStory("petitions", "splashscreen"));
        }
      }
    } else if (feedTab) {
      if (launchParameters.vk_group_id) {
        store.dispatch(setActiveTab("feed", "last"));
      } else {
        store.dispatch(setActiveTab("feed", feedTab[1]));
      }
      store.dispatch(setStory("petitions", "feed"));
    } else if (managed) {
      if (launchParameters.vk_platform === "desktop_web") {
        store.dispatch(setActiveTab("feed", "managed"));
        store.dispatch(setStory("petitions", ""));
      } else if (
        ["moder", "editor", "admin"].includes(
          launchParameters.vk_viewer_group_role
        )
      ) {
        store.dispatch(setActiveTab("feed", "last"));
        store.dispatch(setStory("management", "feed"));
      } else {
        store.dispatch(setActiveTab("feed", "last"));
        store.dispatch(setStory("petitions", "feed"));
      }
    } else {
      store.dispatch(setActiveTab("feed", "last"));
      store.dispatch(setStory("petitions", "feed"));
    }
    initPetitions(launchParameters);
  })
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
    if (isDevEnv()) {
      import("./eruda").then(({ default: eruda }) => {});
    }
  });

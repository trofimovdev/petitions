import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import VkSdk from "@happysanta/vk-apps-sdk";
import store from "./store";
import "./style/index.css";
import App from "./App";
import { setActiveTab, setStory } from "./store/router/actions";
import setColorScheme from "./store/ui/actions";

VkSdk.init();
VkSdk.subscribeEvent("VKWebAppUpdateConfig", ({ scheme }) => {
  store.dispatch(setColorScheme(scheme));
  console.log("SET COLOR SCHEME", scheme);
});
store.dispatch(setStory("petitions", "feed"));
store.dispatch(setActiveTab("feed", "popular"));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import VkSdk from "@happysanta/vk-apps-sdk";
import store from "./store";
import App from "./App";
import { setActiveTab, setStory} from "./store/router/actions";

VkSdk.init();

store.dispatch(setStory("petitions", "feed"));
store.dispatch(setActiveTab("feed", "popular"));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

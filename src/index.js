import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router } from "react-router-dom";
import { ConfigProvider } from "@vkontakte/vkui";
import store from "./store"
import bridge from "@vkontakte/vk-bridge";
// import App from "./App";
// import registerServiceWorker from './sw';

// Init VK  Mini App
bridge.send("VKWebAppInit");

// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
// registerServiceWorker();

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider
      webviewType="vkapps"
      isWebView={isDevEnv() ? true : undefined}
    >
      <Router history={history}>
        <Route
          component={(props) => <MobileContainer {...props}/>}
        />
      </Router>
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);

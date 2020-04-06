// TODO: replace vk-bridge SwipeBack to vk-mini-apps, when PR will be accepted (https://github.com/VKCOM/vk-mini-apps-api/pull/15)
import bridge from "@vkontakte/vk-bridge";

import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { smoothScrollToTop } from "../../tools/helpers";
import {
  SET_PAGE,
  GO_BACK,
  OPEN_POPOUT,
  CLOSE_POPOUT,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_STORY,
  SET_ACTIVE_TAB
} from "./actionTypes";

const api = new VKMiniAppAPI();
const initialState = {
  activeStory: null,
  activeView: null,
  activePanel: null,
  activeTab: null,

  storiesHistory: [],
  viewsHistory: [],
  panelsHistory: [],

  activeModals: [],
  modalHistory: [],
  popouts: [],

  scrollPosition: []
};

const routerReducer = (state = initialState, action) => {
  console.log("router", state, action);
  switch (action.type) {
    case SET_PAGE: {
      console.log("LOL KEK ADASDASDASDASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
      const View = action.payload.view;
      const Panel = action.payload.panel;
      console.log(View, Panel);

      window.history.pushState(null, null);

      let panelsHistory = state.panelsHistory[View] || [];
      const viewsHistory = state.viewsHistory[state.activeStory] || [];
      console.log("panelsHistory123123123", panelsHistory);

      const viewIndexInHistory = viewsHistory.indexOf(View);

      if (viewIndexInHistory !== -1) {
        viewsHistory.splice(viewIndexInHistory, 1);
      }

      if (panelsHistory.indexOf(Panel) === -1) {
        panelsHistory = [...panelsHistory, Panel];
      }
      console.log("panelsHistory AFTER", {
        ...state.panelsHistory,
        [View]: panelsHistory
      });

      if (panelsHistory.length > 1) {
        // TODO: replace with vk-mini-apps-api
        // api.enableSwipeBack();
        bridge.send("VKWebAppEnableSwipeBack");
        console.log("vksdk swipeBackOn");
      }

      return {
        ...state,
        activeView: View,
        activePanel: Panel,

        panelsHistory: {
          ...state.panelsHistory,
          [View]: panelsHistory
        },
        viewsHistory: {
          ...state.viewsHistory,
          [state.activeStory]: [...viewsHistory, View]
        },
        scrollPosition: {
          ...state.scrollPosition,
          [`${state.activeStory}_${state.activeView}_${state.activePanel}`]: window.pageYOffset
        }
      };
    }

    case SET_STORY: {
      window.history.pushState(null, null);

      let viewsHistory = state.viewsHistory[action.payload.story] || [
        action.payload.story
      ];

      let { storiesHistory } = state;
      let activeView = viewsHistory[viewsHistory.length - 1];
      let panelsHistory = state.panelsHistory[activeView] || [
        action.payload.initialPanel
      ];
      let activePanel = panelsHistory[panelsHistory.length - 1];

      if (action.payload.story === state.activeStory) {
        if (panelsHistory.length > 1) {
          const firstPanel = panelsHistory.shift();
          panelsHistory = [firstPanel];

          activePanel = panelsHistory[panelsHistory.length - 1];
        } else if (viewsHistory.length > 1) {
          const firstView = viewsHistory.shift();
          viewsHistory = [firstView];

          activeView = viewsHistory[viewsHistory.length - 1];
          panelsHistory = state.panelsHistory[activeView];
          activePanel = panelsHistory[panelsHistory.length - 1];
        }
      }

      if (
        action.payload.story === state.activeStory &&
        panelsHistory.length === 1 &&
        window.pageYOffset > 0
      ) {
        smoothScrollToTop();
      }

      const storiesIndexInHistory = storiesHistory.indexOf(
        action.payload.story
      );

      if (
        storiesIndexInHistory === -1 ||
        (storiesHistory[0] === action.payload.story &&
          storiesHistory[storiesHistory.length - 1] !== action.payload.story)
      ) {
        storiesHistory = [...storiesHistory, action.payload.story];
      }
      console.log("setStory", {
        ...state,
        activeStory: action.payload.story,
        activeView,
        activePanel,

        storiesHistory,
        viewsHistory: {
          ...state.viewsHistory,
          [activeView]: viewsHistory
        },
        panelsHistory: {
          ...state.panelsHistory,
          [activeView]: panelsHistory
        },

        scrollPosition: {
          ...state.scrollPosition,
          [`${state.activeStory}_${state.activeView}_${state.activePanel}`]: window.pageYOffset
        }
      });

      return {
        ...state,
        activeStory: action.payload.story,
        activeView,
        activePanel,

        storiesHistory,
        viewsHistory: {
          ...state.viewsHistory,
          [activeView]: viewsHistory
        },
        panelsHistory: {
          ...state.panelsHistory,
          [activeView]: panelsHistory
        },

        scrollPosition: {
          ...state.scrollPosition,
          [`${state.activeStory}_${state.activeView}_${state.activePanel}`]: window.pageYOffset
        }
      };
    }

    case GO_BACK: {
      console.log("GO BACK");
      let setView = state.activeView;
      let setPanel = state.activePanel;
      let setStory = state.activeStory;

      const popoutsData = state.popouts;

      if (popoutsData[setView]) {
        popoutsData[setView] = null;

        return {
          ...state,
          popouts: {
            ...state.popouts,
            popoutsData
          }
        };
      }

      let viewModalsHistory = state.modalHistory[setView];

      if (viewModalsHistory !== undefined && viewModalsHistory.length !== 0) {
        const activeModal =
          viewModalsHistory[viewModalsHistory.length - 2] || null;

        if (activeModal === null) {
          viewModalsHistory = [];
        } else if (viewModalsHistory.indexOf(activeModal) !== -1) {
          viewModalsHistory = viewModalsHistory.splice(
            0,
            viewModalsHistory.indexOf(activeModal) + 1
          );
        } else {
          viewModalsHistory.push(activeModal);
        }

        return {
          ...state,
          activeModals: {
            ...state.activeModals,
            [setView]: activeModal
          },
          modalHistory: {
            ...state.modalHistory,
            [setView]: viewModalsHistory
          }
        };
      }

      const panelsHistory = state.panelsHistory[setView] || [];
      const viewsHistory = state.viewsHistory[state.activeStory] || [];
      const { storiesHistory } = state;

      if (panelsHistory.length > 1) {
        panelsHistory.pop();

        setPanel = panelsHistory[panelsHistory.length - 1];
      } else if (viewsHistory.length > 1) {
        viewsHistory.pop();

        setView = viewsHistory[viewsHistory.length - 1];
        const panelsHistoryNew = state.panelsHistory[setView];

        setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
      } else if (storiesHistory.length > 1) {
        storiesHistory.pop();

        setStory = storiesHistory[storiesHistory.length - 1];
        setView =
          state.viewsHistory[setStory][state.viewsHistory[setStory].length - 1];

        const panelsHistoryNew = state.panelsHistory[setView];

        if (panelsHistoryNew.length > 1) {
          setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
        } else {
          setPanel = panelsHistoryNew[0];
        }
      } else {
        api.closeApp("success");
        console.log("vksdk closeApp");
      }

      if (panelsHistory.length === 1) {
        // TODO: replace with vk-mini-apps-api
        // api.disableSwipeBack();
        bridge.send("VKWebAppDisableSwipeBack");
        console.log("vksdk disableSwipeBack");
      }

      console.log("panelsHistory goBack", {
        ...state.panelsHistory,
        [state.activeView]: panelsHistory
      });

      return {
        ...state,
        activeView: setView,
        activePanel: setPanel,
        activeStory: setStory,

        viewsHistory: {
          ...state.viewsHistory,
          [state.activeView]: viewsHistory
        },
        panelsHistory: {
          ...state.panelsHistory,
          [state.activeView]: panelsHistory
        }
      };
    }

    case OPEN_POPOUT:
      window.history.pushState(null, null);

      return {
        ...state,
        popouts: {
          ...state.popouts,
          [state.activeView]: action.payload.popout
        }
      };

    case CLOSE_POPOUT:
      return {
        ...state,
        popouts: {
          ...state.popouts,
          [state.activeView]: null
        }
      };

    case OPEN_MODAL: {
      console.log("OPEN MODAL");
      window.history.pushState(null, null);

      const activeModal = action.payload.id || null;
      let modalsHistory = state.modalHistory[state.activeView]
        ? [...state.modalHistory[state.activeView]]
        : [];

      if (activeModal === null) {
        modalsHistory = [];
      } else if (modalsHistory.indexOf(activeModal) !== -1) {
        modalsHistory = modalsHistory.splice(
          0,
          modalsHistory.indexOf(activeModal) + 1
        );
      } else {
        modalsHistory.push(activeModal);
      }

      return {
        ...state,
        activeModals: {
          ...state.activeModals,
          [state.activeView]: activeModal
        },
        modalHistory: {
          ...state.modalHistory,
          [state.activeView]: modalsHistory
        }
      };
    }

    case CLOSE_MODAL: {
      const activeModal =
        state.modalHistory[state.activeView][
          state.modalHistory[state.activeView].length - 2
        ] || null;
      let modalsHistory = state.modalHistory[state.activeView]
        ? [...state.modalHistory[state.activeView]]
        : [];

      if (activeModal === null) {
        modalsHistory = [];
      } else if (modalsHistory.indexOf(activeModal) !== -1) {
        modalsHistory = modalsHistory.splice(
          0,
          modalsHistory.indexOf(activeModal) + 1
        );
      } else {
        modalsHistory.push(activeModal);
      }

      return {
        ...state,
        activeModals: {
          ...state.activeModals,
          [state.activeView]: activeModal
        },
        modalHistory: {
          ...state.modalHistory,
          [state.activeView]: modalsHistory
        }
      };
    }

    case SET_ACTIVE_TAB: {
      let scrollPosition1 = {};
      if (state.activeTab && state.activeTab[state.activePanel]) {
        console.log(
          `set scrollPosition ${window.pageYOffset} in tab ${
            state.activePanel
          }_${state.activeTab[state.activePanel]}`
        );
        scrollPosition1 = {
          ...state.scrollPosition,
          [`${state.activeStory}_${state.activeView}_${state.activePanel}_${
            state.activeTab[state.activePanel]
          }`]: window.pageYOffset
        };
      } else {
        scrollPosition1 = {
          ...state.scrollPosition,
          [`${state.activeStory}_${state.activeView}_${state.activePanel}`]: window.pageYOffset
        };
      }
      console.log("setActiveTab", {
        ...state,
        activeTab: {
          ...state.activeTab,
          [action.payload.component]: action.payload.tab
        },
        scrollPosition: scrollPosition1
      });
      return {
        ...state,
        activeTab: {
          ...state.activeTab,
          [action.payload.component]: action.payload.tab
        },
        scrollPosition: scrollPosition1
      };
    }

    default:
      return state;
  }
};

export default routerReducer;

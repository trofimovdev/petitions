import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { smoothScrollToTop } from "../../tools/helpers";
import {
  SET_PAGE,
  GO_BACK,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_STORY,
  SET_ACTIVE_TAB,
  OPEN_POPOUT,
  CLOSE_POPOUT
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
  switch (action.type) {
    case SET_PAGE: {
      const View = action.payload.view;
      const Panel = action.payload.panel;
      const { disableSwipeBack } = action.payload;
      const { rewriteHistory } = action.payload;
      const { history } = action.payload;

      window.history.pushState(null, null);

      let panelsHistory = state.panelsHistory[View] || [];
      const viewsHistory = state.viewsHistory[state.activeStory] || [];

      const viewIndexInHistory = viewsHistory.indexOf(View);

      if (viewIndexInHistory !== -1) {
        viewsHistory.splice(viewIndexInHistory, 1);
      }

      if (panelsHistory.indexOf(Panel) === -1) {
        panelsHistory = [...panelsHistory, Panel];
      }

      if (panelsHistory.length > 1 && !disableSwipeBack) {
        api.enableSwipeBack();
      } else {
        api.disableSwipeBack();
      }

      let scrollPosition = {};
      if (action.payload.web) {
        scrollPosition = {
          ...state.scrollPosition,
          [`${state.activeView}_${state.activeTab.feed}`]: window.pageYOffset
        };
      } else {
        scrollPosition = {
          ...state.scrollPosition,
          [`${state.activeStory}_${state.activeView}_${state.activePanel}`]: window.pageYOffset
        };
      }

      return {
        ...state,
        activeView: View,
        activePanel: Panel,

        panelsHistory: {
          ...state.panelsHistory,
          [View]: rewriteHistory ? history : panelsHistory
        },
        viewsHistory: {
          ...state.viewsHistory,
          [state.activeStory]: [...viewsHistory, View]
        },
        scrollPosition
      };
    }

    case SET_STORY: {
      window.history.pushState(null, null);

      let viewsHistory = state.viewsHistory[action.payload.story] || [
        action.payload.story
      ];

      let { storiesHistory } = state;
      let activeView = viewsHistory[viewsHistory.length - 1];
      let panelsHistory = action.payload.withHistory
        ? state.panelsHistory[activeView] || [action.payload.initialPanel]
        : [];
      let activePanel = action.payload.withHistory
        ? panelsHistory[panelsHistory.length - 1]
        : action.payload.initialPanel;

      if (action.payload.withHistory) {
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
          [`${state.activeStory}_${state.activeView}_${state.activePanel}_${
            state.activeTab[state.activePanel]
          }`]: window.pageYOffset
        }
      };
    }

    case GO_BACK: {
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
      }

      if (panelsHistory.length === 1) {
        api.disableSwipeBack();
      }

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

    case OPEN_MODAL: {
      api.disableSwipeBack();
      window.history.pushState(null, null);

      const activeModal = action.payload || null;
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
      api.enableSwipeBack();
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
      if (action.payload.web) {
        scrollPosition1 = {
          ...state.scrollPosition,
          [`${state.activeView}_${state.activeTab.feed}`]: window.pageYOffset
        };
      } else if (state.activeTab && state.activeTab[state.activePanel]) {
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

      return {
        ...state,
        activeTab: {
          ...state.activeTab,
          [action.payload.component]: action.payload.tab
        },
        scrollPosition: scrollPosition1
      };
    }

    case OPEN_POPOUT: {
      window.history.pushState(null, null);

      return {
        ...state,
        popouts: {
          ...state.popouts,
          [state.activeView]: action.payload.popout
        }
      };
    }

    case CLOSE_POPOUT: {
      return {
        ...state,
        popouts: {
          ...state.popouts,
          [state.activeView]: null
        }
      };
    }

    default:
      return state;
  }
};

export default routerReducer;

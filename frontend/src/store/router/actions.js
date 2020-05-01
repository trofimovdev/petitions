import {
  SET_PAGE,
  SET_STORY,
  GO_BACK,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_ACTIVE_TAB,
  OPEN_POPOUT,
  CLOSE_POPOUT
} from "./actionTypes";

export const setStory = (story, initialPanel, withHistory = true) => ({
  type: SET_STORY,
  payload: {
    story,
    initialPanel,
    withHistory
  }
});

export const setPage = (view, panel, disableSwipeBack = false, rewriteHistory = false, history = []) => ({
  type: SET_PAGE,
  payload: {
    view,
    panel,
    disableSwipeBack,
    rewriteHistory,
    history
  }
});

export const goBack = () => ({
  type: GO_BACK
});

export const openModal = id => ({
  type: OPEN_MODAL,
  payload: id
});

export const closeModal = () => ({
  type: CLOSE_MODAL
});

export const setActiveTab = (component, tab) => ({
  type: SET_ACTIVE_TAB,
  payload: {
    component,
    tab
  }
});

export const openPopout = popout => ({
  type: OPEN_POPOUT,
  payload: {
    popout
  }
});

export const closePopout = () => ({
  type: CLOSE_POPOUT
});

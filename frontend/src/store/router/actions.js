import {
  SET_PAGE,
  SET_STORY,
  GO_BACK,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_ACTIVE_TAB
} from "./actionTypes";

export const setStory = (story, initialPanel) => ({
  type: SET_STORY,
  payload: {
    story,
    initialPanel
  }
});

export const setPage = (view, panel, withHistory = true) => ({
  type: SET_PAGE,
  payload: {
    view,
    panel,
    withHistory
  }
});

export const goBack = () => ({
  type: GO_BACK
});

export const openModal = id => ({
  type: OPEN_MODAL,
  payload: {
    id
  }
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

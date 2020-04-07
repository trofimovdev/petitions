import { SET_POPULAR, SET_LAST, SET_SIGNED, SET_CURRENT } from "./actionTypes";

export const setPopular = petitions => ({
  type: SET_POPULAR,
  payload: {
    petitions
  }
});

export const setLast = petitions => ({
  type: SET_LAST,
  payload: {
    petitions
  }
});

export const setSigned = petitions => ({
  type: SET_SIGNED,
  payload: {
    petitions
  }
});

export const setCurrent = petition => ({
  type: SET_CURRENT,
  payload: {
    petition
  }
});

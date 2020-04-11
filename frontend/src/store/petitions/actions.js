import {
  SET_POPULAR,
  SET_LAST,
  SET_SIGNED,
  SET_MANAGED,
  SET_CURRENT,
  SET_CREATE,
  SET_EDIT,
  SET_FORM_TYPE
} from "./actionTypes";

export const setPopular = petitions => ({
  type: SET_POPULAR,
  payload: petitions
});

export const setLast = petitions => ({
  type: SET_LAST,
  payload: petitions
});

export const setSigned = petitions => ({
  type: SET_SIGNED,
  payload: petitions
});

export const setManaged = petitions => ({
  type: SET_MANAGED,
  payload: petitions
});

export const setCurrent = petition => ({
  type: SET_CURRENT,
  payload: petition
});

export const setCreate = field => ({
  type: SET_CREATE,
  payload: field
});

export const setEdit = field => ({
  type: SET_EDIT,
  payload: field
});

export const setFormType = type => ({
  type: SET_FORM_TYPE,
  payload: type
});

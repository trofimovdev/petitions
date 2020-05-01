import {
  SET_POPULAR,
  SET_LAST,
  SET_SIGNED,
  SET_MANAGED,
  SET_CURRENT,
  SET_CREATE,
  SET_EDIT,
  SET_FORM_TYPE,
  SET_INITIAL_EDIT
} from "./actionTypes";

const initialState = {
  popular: undefined,
  last: undefined,
  signed: undefined,
  managed: undefined,
  current: {},
  create: {},
  edit: {},
  initialEdit: {},
  formType: "create"
};

const petitionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POPULAR: {
      return {
        ...state,
        popular: action.payload
      };
    }

    case SET_LAST: {
      return {
        ...state,
        last: action.payload
      };
    }

    case SET_SIGNED: {
      return {
        ...state,
        signed: action.payload
      };
    }

    case SET_MANAGED: {
      return {
        ...state,
        managed: action.payload
      };
    }

    case SET_CURRENT: {
      return {
        ...state,
        current: action.payload
      };
    }

    case SET_CREATE: {
      return {
        ...state,
        create: {
          ...state.create,
          ...action.payload
        }
      };
    }

    case SET_EDIT: {
      return {
        ...state,
        edit: {
          ...state.edit,
          ...action.payload
        }
      };
    }

    case SET_INITIAL_EDIT: {
      return {
        ...state,
        initialEdit: action.payload
      };
    }

    case SET_FORM_TYPE: {
      return {
        ...state,
        formType: action.payload
      };
    }

    default:
      return state;
  }
};

export default petitionsReducer;

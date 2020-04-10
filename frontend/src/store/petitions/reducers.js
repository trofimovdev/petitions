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

const initialState = {
  popular: undefined,
  last: undefined,
  signed: undefined,
  managed: undefined,
  current: {},
  create: {},
  edit: {},
  formType: "create"
};

const petitionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POPULAR: {
      const { petitions } = action.payload;
      return {
        ...state,
        popular: petitions
      };
    }

    case SET_LAST: {
      const { petitions } = action.payload;
      return {
        ...state,
        last: petitions
      };
    }

    case SET_SIGNED: {
      const { petitions } = action.payload;
      return {
        ...state,
        signed: petitions
      };
    }

    case SET_MANAGED: {
      const { petitions } = action.payload;
      return {
        ...state,
        managed: petitions
      };
    }

    case SET_CURRENT: {
      const { petition } = action.payload;
      return {
        ...state,
        current: petition
      };
    }

    case SET_CREATE: {
      const { field } = action.payload;
      console.log("NEXT TWO LINES");
      console.log(field);
      console.log({
        ...state,
        create: {
          ...state.create,
          ...field
        }
      });
      return {
        ...state,
        create: {
          ...state.create,
          ...field
        }
      };
    }

    case SET_EDIT: {
      const { field } = action.payload;
      console.log("NEXT TWO LINES");
      console.log(field);
      console.log({ ...state, ...field });
      return {
        ...state,
        edit: {
          ...state.edit,
          ...field
        }
      };
    }

    case SET_FORM_TYPE: {
      const { formType } = action.payload;
      console.log(formType);
      return {
        ...state,
        formType
      };
    }

    default:
      return state;
  }
};

export default petitionsReducer;

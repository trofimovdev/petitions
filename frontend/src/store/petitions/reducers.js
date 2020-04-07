import { SET_POPULAR, SET_LAST, SET_SIGNED, SET_CURRENT } from "./actionTypes";

const initialState = {
  popular: [],
  last: [],
  signed: [],
  current: {}
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

    case SET_CURRENT: {
      const { petition } = action.payload;
      return {
        ...state,
        current: petition
      };
    }

    default:
      return state;
  }
};

export default petitionsReducer;

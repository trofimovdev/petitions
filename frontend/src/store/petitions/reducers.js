import { SET_POPULAR, SET_LAST, SET_SIGNED } from "./actionTypes";

const initialState = {
  popular: [],
  last: [],
  signed: []
};

const petitionsReducer = (state = initialState, action) => {
  console.log("petitions", state, action);
  switch (action.type) {
    case SET_POPULAR: {
      const petitions = action.payload.petitions;
      return {
        ...state,
        popular: petitions
      };
    }

    case SET_LAST: {
      const petitions = action.payload.petitions;
      return {
        ...state,
        last: petitions
      };
    }

    case SET_SIGNED: {
      const petitions = action.payload.petitions;
      return {
        ...state,
        signed: petitions
      };
    }

    default:
      return state;
  }
};

export default petitionsReducer;

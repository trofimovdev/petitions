import { SET_COLOR_SCHEME, SET_PETITIONS_FEED_CARD } from "./actionTypes";

const initialState = {
  colorScheme: "bright_light",
  petitionsFeedCard: undefined
};

const uiReducer = (state = initialState, action) => {
  console.log("ui", state, action);
  switch (action.type) {
    case SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.payload
      };

    case SET_PETITIONS_FEED_CARD:
      return {
        ...state,
        petitionsFeedCard: action.payload
      };

    default:
      return state;
  }
};

export default uiReducer;

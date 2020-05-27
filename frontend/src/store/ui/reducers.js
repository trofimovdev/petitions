import { SET_COLOR_SCHEME } from "./actionTypes";

const initialState = {
  colorScheme: "bright_light"
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.payload
      };

    default:
      return state;
  }
};

export default uiReducer;

import SET_COLOR_SCHEME from "./actionTypes";

const initialState = {
  colorScheme: "client_light"
};

const uiReducer = (state = initialState, action) => {
  if (action.type === SET_COLOR_SCHEME) {
    return {
      ...state,
      colorScheme: action.payload
    };
  }
  return state;
};

export default uiReducer;

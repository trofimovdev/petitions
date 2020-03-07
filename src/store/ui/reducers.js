import SET_COLOR_SCHEME from "./actionTypes";

const initialState = {
  colorScheme: "space_gray"
};

const uiReducer = (state = initialState, action) => {
  console.log("ui", state, action);
  if (action.type === SET_COLOR_SCHEME) {
    return {
      ...state,
      colorScheme: action.payload
    };
  }
  return state;
};

export default uiReducer;

import { SET_ACCESS_TOKEN, SET_LAUNCH_PARAMETERS } from "./actionTypes";

const initialState = {
  accessToken: undefined,
  launchParameters: undefined
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.payload
      };
    }

    case SET_LAUNCH_PARAMETERS: {
      return {
        ...state,
        launchParameters: action.payload
      };
    }

    default:
      return state;
  }
};

export default dataReducer;

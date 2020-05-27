import {
  SET_FRIENDS_CARD_STATUS,
  SET_LAUNCH_PARAMETERS,
  SET_INIT_ERROR
} from "./actionTypes";

const initialState = {
  friendsCardStatus: true,
  launchParameters: undefined,
  initError: false
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRIENDS_CARD_STATUS: {
      return {
        ...state,
        friendsCardStatus: action.payload
      };
    }

    case SET_LAUNCH_PARAMETERS: {
      return {
        ...state,
        launchParameters: action.payload
      };
    }

    case SET_INIT_ERROR: {
      return {
        ...state,
        initError: action.payload
      };
    }

    default:
      return state;
  }
};

export default dataReducer;

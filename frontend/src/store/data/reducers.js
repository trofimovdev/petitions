import {
  SET_FRIENDS_CARD_STATUS,
  SET_LAUNCH_PARAMETERS,
  SET_INIT_ERROR,
  SET_ONLINE,
  SET_APP_ID
} from "./actionTypes";

const initialState = {
  friendsCardStatus: true,
  launchParameters: undefined,
  initError: false,
  online: true
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

    case SET_ONLINE: {
      return {
        ...state,
        online: action.payload
      };
    }

    case SET_APP_ID: {
      return {
        ...state,
        appId: action.payload
      };
    }

    default:
      return state;
  }
};

export default dataReducer;

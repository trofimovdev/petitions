import { SET_FRIENDS_CARD_STATUS, SET_LAUNCH_PARAMETERS } from "./actionTypes";

const initialState = {
  friendsCardStatus: true,
  launchParameters: undefined
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

    default:
      return state;
  }
};

export default dataReducer;

import { SET_FRIENDS_CARD_STATUS, SET_LAUNCH_PARAMETERS } from "./actionTypes";

export const setFriendsCardStatus = status => ({
  type: SET_FRIENDS_CARD_STATUS,
  payload: status
});

export const setLaunchParameters = parameters => ({
  type: SET_LAUNCH_PARAMETERS,
  payload: parameters
});

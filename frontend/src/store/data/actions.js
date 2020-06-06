import {
  SET_FRIENDS_CARD_STATUS,
  SET_LAUNCH_PARAMETERS,
  SET_INIT_ERROR,
  SET_ONLINE
} from "./actionTypes";

export const setFriendsCardStatus = status => ({
  type: SET_FRIENDS_CARD_STATUS,
  payload: status
});

export const setLaunchParameters = parameters => ({
  type: SET_LAUNCH_PARAMETERS,
  payload: parameters
});

export const setInitError = value => ({
  type: SET_INIT_ERROR,
  payload: value
});

export const setOnline = value => ({
  type: SET_ONLINE,
  payload: value
});

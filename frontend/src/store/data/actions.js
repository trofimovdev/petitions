import { SET_ACCESS_TOKEN, SET_LAUNCH_PARAMETERS } from "./actionTypes";

export const setAccessToken = token => ({
  type: SET_ACCESS_TOKEN,
  payload: token
});

export const setLaunchParameters = parameters => ({
  type: SET_LAUNCH_PARAMETERS,
  payload: parameters
});

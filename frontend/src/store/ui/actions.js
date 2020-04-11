import { SET_COLOR_SCHEME, SET_PETITIONS_FEED_CARD } from "./actionTypes";

export const setColorScheme = scheme => ({
  type: SET_COLOR_SCHEME,
  payload: scheme
});

export const setPetitionsFeedCard = card => ({
  type: SET_PETITIONS_FEED_CARD,
  payload: card
});

import SET_COLOR_SCHEME from "./actionTypes";

const setColorScheme = scheme => ({
  type: SET_COLOR_SCHEME,
  payload: scheme
});

export default setColorScheme;

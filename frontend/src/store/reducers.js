import { combineReducers } from "redux";
import routerReducer from "./router/reducers";
import uiReducer from "./ui/reducers";

export default combineReducers({
  router: routerReducer,
  ui: uiReducer
});

import { combineReducers } from "redux";
import routerReducer from "./router/reducers";

export default combineReducers({
  router: routerReducer
});

import { combineReducers } from "redux";
import routerReducer from "./router/reducers";
import uiReducer from "./ui/reducers";
import petitionsReducer from "./petitions/reducers";

export default combineReducers({
  router: routerReducer,
  ui: uiReducer,
  petitions: petitionsReducer
});

import Backend from "../tools/Backend";
import { setFatalError } from "./FatalErrorModule";
import { initUser } from "./UserModule";
import User from "../entities/User";
import { initDailyState } from "./DailyStateModule";
import DailyState from "../entities/DailyState";

export const SET_BOOTSTRAP = "BootstrapModule.SET_BOOTSTRAP";

const initState = {
  loaded: false,
  stateSchema: null,
  stateData: null
};

const BootstrapModule = (state = initState, action) => {
  if (action.type === SET_BOOTSTRAP) {
    return { ...state, ...action.update };
  }
  return state;
};

export function setBootstrap(update) {
  return { type: SET_BOOTSTRAP, update };
}

export function bootstrap(onSuccess) {
  return (dispatch, getState) => {
    const { loaded } = getState().BootstrapModule;
    if (loaded) {
      onSuccess();
      return;
    }
    Backend.request("bootstrap", {})
      .then(r => {
        console.log(r);
      })
      .catch(e => {
        // dispatch(setFatalError(e));
        console.log(e);
      });
  };
}

export default BootstrapModule;

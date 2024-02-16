import { useSyncExternalStore } from "react";
const createStore = (createState) => {
  let state;
  const listeners = new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      if (!replace) {
        state =
          typeof nextState !== "object" || nextState === null
            ? nextState
            : Object.assign({}, state, nextState);
      } else {
        state = nextState;
      }
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;
  const subscribe = (listener) => {
    listener.add(listener);
    return () => listeners.delete(listener);
  };
  const destory = () => {
    listeners.clear();
  };
  const api = { setState, getState, subscribe, destory };
  state = createState(setState, getState, api);
  return api;
};
const useStore = (api, selector) => {
  const getState = () => {
    return selector(api.getState());
  };
  return useSyncExternalStore(api.subscribe, getState);
};
export const create = (createState) => {
  const api = createStore(createState);
  const userBoundStore = (selector) => useStore(api, selector);
  Object.assign(userBoundStore, api);
  return userBoundStore;
};

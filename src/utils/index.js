import { useSyncExternalStore } from "react";
/*  createState 的函数作为参数，该函数用于创建初始状态并返回。在内部，它维护了状态 (state)
、监听器集合 (listeners)，以及一些操作状态的方法
，比如 setState 用于更新状态，getState 用于获取当前状态，
subscribe 用于订阅状态变化，destroy 用于清除所有监听器。*/
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
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destory = () => {
    listeners.clear();
  };

  const api = { setState, getState, subscribe, destory };

  state = createState(setState, getState, api);

  return api;
};
/* 
用于在组件中订阅状态管理实例的状态变化。它接收两个参数
：api 是状态管理实例提供的一系列方法，selector 是一个函数，用于选择性地提取状态的一部分。
内部使用了 useSyncExternalStore 这个 React Hook，用于同步外部的状态变化到组件。
 */
function UseStore(api, selector) {
  const getState = () => {
    return selector(api.getState());
  };

  return useSyncExternalStore(api.subscribe, getState);
}
/* 它接收一个名为 createState 的函数，调用 createStore 创建状态管理实例，
并返回一个包含了部分状态管理实例方法的函数 userBoundStore，
同时还将状态管理实例的所有方法绑定到这个函数上，以便外部使用。 */
export const create = (createState) => {
  const api = createStore(createState);
  const userBoundStore = (selector) => UseStore(api, selector);
  Object.assign(userBoundStore, api);
  return userBoundStore;
};

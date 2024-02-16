import { create } from ".utils/index.js";
import React from "react";
import ReactDOM from "react-dom";
// 创建状态管理实例
const myStore = create((setState, getState) => {
  return {
    count: 0,
    increment: () => setState((prevState) => ({ count: prevState.count + 1 })),
    decrement: () => setState((prevState) => ({ count: prevState.count - 1 })),
    reset: () => setState({ count: 0 }),
  };
});

// 在组件中使用状态管理实例
function Counter() {
  const count = myStore((state) => state.count);
  const increment = myStore((state) => state.increment);
  const decrement = myStore((state) => state.decrement);
  const reset = myStore((state) => state.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}



export default Counter;

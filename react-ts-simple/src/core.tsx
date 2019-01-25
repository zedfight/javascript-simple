import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware, StoreEnhancer } from "redux";
import { Provider } from "react-redux";

const initialState = {
  app: {}
};

interface ActionType {
  type: string;
  name: string;
  payload: object;
}

function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case "setState":
      const nextState = { ...state };
      nextState["app"][action.name] = action.payload;
      return nextState;
    default:
      return state;
  }
}

function createApp() {
  const store = createStore(reducer, devtools(applyMiddleware()));
  store.subscribe(() => console.info("redux store update!!"));
  store.dispatch({
    type: "setState",
    name: "test",
    payload: { name: "manual trigger" }
  });

  return { store };
}
const { store } = createApp();

function devtools(enhancer: StoreEnhancer): StoreEnhancer {
  const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (extension) {
    return compose(
      enhancer,
      extension({})
    );
  }
  return enhancer;
}

export function render(Component: ComponentType) {
  const rootElement = document.createElement("div");
  rootElement.id = "root";
  document.body.appendChild(rootElement);
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    rootElement
  );
}

export function register(name: string, payload: object) {
  store.dispatch({
    type: "setState",
    name,
    payload
  });
}

/*
    Attention:
    1.技术栈：react, redux, webpack, typescript
    2.tsconfig 配置文件与 typescript 依赖参考 TypeScript-React-Starter ref：https://github.com/Microsoft/TypeScript-React-Starter。tsconfig.js
      改动：
        1).删除rootDir, 
        2)."baseUrl": "./src" 否则引入import { Main } from "module/main"; 时报错 module/main 无法找到 
        3).新增 "allowSyntheticDefaultImports": true 否则会导致错误类似: Module 'xxx/@types/react/index' has no default export.
    3.webpack 中的 extensions 必须加上 js/jsx ，否则会导致错误类似：Can't resolve './BrowserRouter' in 'xxx\node_modules\react-router-dom\es'
*/

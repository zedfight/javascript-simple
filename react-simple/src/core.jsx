import React from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";

const initialState = {
  app: {}
};

function reducer(state = initialState, action) {
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

function devtools(enhancer) {
  const extension = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (extension) {
    return compose(
      enhancer,
      extension({})
    );
  }
  return enhancer;
}

export function render(Component) {
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

export function register(name, payload) {
  store.dispatch({
    type: "setState",
    name,
    payload
  });
}

/*
    Attention:
    1.技术栈：react, redux, webpcak
    2.必须保证render在register之前执行否则会导致在register中store无法获取（所有逻辑集中在src/index.js中会导致此情况，所以新建core.jsx）
    3.Router必须在Switch外层
    4.需要新增异步处理逻辑
    5.需要新增code splitting
    6.js/jsx处理es6的语法需要添加@babel/core、babel-core、babel-loader，处理react语法需要添加babel-preset-react，并且需要为同一大版本，目前保持7.0.0以上。
*/

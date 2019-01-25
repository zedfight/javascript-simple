import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware, StoreEnhancer } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware, { SagaIterator } from "redux-saga";
import { takeEvery } from "redux-saga/effects";

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
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducer, devtools(applyMiddleware(sagaMiddleware)));
  const handlers = new Handlers();
  sagaMiddleware.run(saga, handlers);
  store.subscribe(() => console.info("redux store update!!"));
  store.dispatch({
    type: "setState",
    name: "test",
    payload: { name: "manual trigger" }
  });

  return { store, sagaMiddleware, handlers };
}
const { store } = createApp();

function* saga(handlers: any): SagaIterator {
  console.log("saga");
  yield takeEvery("*", function*(action) {
    console.log(action);
    yield 1;
  });
}

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

type ActionHandler = (...args: any[]) => SagaIterator;
class Handlers {
  readonly effects: { [actionType: string]: ActionHandler } = {};
}

export class Handler {
  readonly module: string;
  constructor(moduleName: string) {
    this.module = moduleName;
  }
}

/*
    Attention:
    1.技术栈：react, redux, redux-saga, webpack, typescript
    2.sagaMiddleware.run 加载只执行一次，该方法中挂载 takeEvery 方法可以监听项目中所有的dispatch
    3.待完成：将各模块逻辑方法封装成 action 形式以 payload 保存原逻辑，只有在 dispatch 时真正触发 payload
*/

import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose  } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import Stocks from './components/stocks.js';
import WSInstance from './utils/WebsocketUtil.js';
import * as Actions from './actions/ActionsCreators.js';
import * as ActionTypes from './constants/ActionTypes.js';

const reducer = combineReducers(reducers);

function configureStore() {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
  const store = finalCreateStore(reducer);

  if (module.hot) {
    module.hot.accept('./reducers/', () => {
      const nextRootReducer = require('./reducers/index.js');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const redux = configureStore();

function selectState(state) {
  return state;
}

React.render(
  <div>
    <Provider store={redux}>
      {() => <Stocks />}
    </Provider>
  </div>,
  document.getElementById("appview")
);


const URL = 'stocks.mnet.website';

const sock = {
  ws: null,
  URL: URL,
  wsDipatcher: (msg) => {
    return redux.dispatch(Actions.receiveMessage(msg));
  },
  wsListener: () => {
    const { lastAction } = redux.getState();

    switch (lastAction.type) {
      case ActionTypes.CONNECT:
        return sock.startWS();

      case ActionTypes.DISCONNECT:
        return sock.stopWS();

      default:
        return;
    }
  },
  stopWS: () => {
    sock.ws.close();
    sock.ws = null
  },
  startWS: () => {
    if(!!sock.ws) sock.ws.close();

    sock.ws = new WSInstance(sock.URL, sock.wsDipatcher)
  }
};

redux.subscribe(() => sock.wsListener());

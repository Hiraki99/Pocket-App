import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from 'redux-saga';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import {initAuthState} from '~/constants/initReducer';
import {LOGOUT, LOGOUT_SUCCESS} from '~/features/authentication/AuthenType';

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];

  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'course', 'lesson', 'config'],
    timeout: 0,
    stateReconciler: autoMergeLevel2,
  };
  const appReducer = combineReducers(rootReducer);
  const root = (state, action) => {
    let data = state;
    if (action.type === LOGOUT_SUCCESS || action.type === LOGOUT) {
      data = {
        auth: {
          ...initAuthState,
          fcmToken: state.auth.fcmToken,
        },
      };
    }
    return appReducer(data, action);
  };
  if (__DEV__) {
    // const createDebugger = require('redux-flipper').default;
    // middlewares.push(createDebugger());
  }

  const persistedReducer = persistReducer(persistConfig, root);
  const store = createStore(
    persistedReducer,
    {},
    compose(
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
        : (f) => f,
    ),
  );

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);
  return {
    store,
    persistor,
  };
};

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import render from './render';
import app from './app';
import user from './user';

export default combineReducers({
  router: routerReducer,
  render,
  ui: combineReducers({
    app,
  }),
  user,
});

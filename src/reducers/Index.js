import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Navigation from './NavReducer';
import RenderReducer from './RenderReducer';

export default combineReducers({
  router: routerReducer,
  nav: Navigation,
  render: RenderReducer,
});

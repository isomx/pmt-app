import { renderActions } from '../actions/actionTypes';

export default function (state = {}, action) {
  switch (action.type) {

    case renderActions.LOAD_DATA:
    case renderActions.DATA_LOADING:
    case renderActions.DATA_LOADED:
      const newState = {...state, ...action.payload};
      return newState;
    default:
      return state;
  }
}
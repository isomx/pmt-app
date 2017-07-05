import { navActions } from '../actions/actionTypes';

export default function (state = {}, action) {
  switch (action.type) {
    case navActions.LOCATION_CHANGE:
      let newState = {...state};
      return newState;
    default:
      return state;
  }
}
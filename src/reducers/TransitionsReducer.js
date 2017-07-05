import { navActions } from '../actions/actionTypes';

export default function (state = {nonce: 0}, action) {
  switch (action.type) {
    case navActions.LOCATION_CHANGE:
      return state;
    default:
      return state;
  }
}
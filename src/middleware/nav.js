/* eslint-disable */

import { createLogic } from 'redux-logic';
import { navActions } from '../actions/actionTypes';
import { push } from 'react-router-redux';
import updateNav from '../routes';

// location.pathname.split('/')[1];

const buildLocationObj = (payload) => {
  const locOrUrl = payload.url ? payload.url : (payload.location ? payload.location : null);
  if (!locOrUrl) return null;
  let location = {};
  if (typeof locOrUrl === 'string') {
    const parts = locOrUrl.split('?');
    location.pathname = parts[0];
    if (parts[1]) {
      location.search = '?' + parts[1];
    }
  } else {
    location = locOrUrl;
  }
  return location;
}

export const nav = createLogic({
  type: [navActions.LOCATION_CHANGE],
  cancelType: ['REGISTER_ROOT_CANCEL'],
  debounce: 0,
  throttle: 0,
  latest: true, //default
  transform({ getState, action }, next, reject) {
    const location = buildLocationObj(action.payload);
    if (!location) {
      reject();
      return;
    }
    next(push(location));





    switch(action.payload.transitionType) {
      case 'anchorCommonElement':
        console.log('logic store = ', getState());
        let { groupId, anchorId, commonElementId } = action.payload;
        if (!groupId || !anchorId || !commonElementId) {
          console.log('rejecting..');
          reject();
          return;
        }
        let nonce = getState().transitions.nonce;
        /**
         location.state = {
          nonce: nonce++,
          group: store[groupId],
          anchor: store[anchorId],
          commonElement: store[commonElementId],
        };
         **/
        location.state = {
          nonce: nonce++,
          groupId,
          anchorId,
          commonElementId,
        };
        console.log('location = ', location);
        next(push(location));
        // next(push(location));
        // next(action);
        //next(push(...location));
        /**
         next({
          type: '@@router/CALL_HISTORY_METHOD',
          //type: navActions.LOCATION_CHANGE,
          payload: {
            method: 'push',
            location,
          },
        });
         **/
        /**
         next({
          type: navActions.LOCATION_CHANGE,
          //type: mdTransitionActions.TRANSITION_ROUTE,
          payload: {
            location
          },
        });
         **/
        break;
      default:
        reject();
    }
  },
  process({ getState, action }, dispatch, done) {
    //dispatch(push(action.payload.location));
    // dispatch(action);
    console.log('processing action = ', action);
    console.log('PROCESSING STATE = ', getState());
    dispatch(push('/dashboard'));
    // dispatch(push(action.payload.location));
    //dispatch(push(action.payload));
    // history.push(location);
    done();
  }
});
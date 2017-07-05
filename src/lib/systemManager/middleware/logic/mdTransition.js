/* eslint-disable */
import { createLogic } from 'redux-logic';
import { navActions, mdTransitionActions } from '../../../../actions/actionTypes';
import difference from 'lodash/difference';
import { logicActions } from '../../actions/held/transitionActions';
// import Rx from 'rxjs/Rx';
import { push } from 'react-router-redux';
import { history } from '../../../../store';


export const mdTransition = createLogic({
  type: [mdTransitionActions.TRANSITION_ROUTE],
  cancelType: ['REGISTER_ROOT_CANCEL'],
  debounce: 0,
  throttle: 0,
  latest: true, //default
  transform({ getState, action }, next, reject) {
    //action.type = navActions.LOCATION_CHANGE;
    console.log('LOGIC TRANSFORM');
    const locOrUrl = action.payload.url ? action.payload.url : (action.payload.location ? action.payload.location : null);
    if (!locOrUrl) {
      reject();
      return;
    }
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
    console.log('action = ', action);
    const store = logicActions.getStore();
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

/**
export const mdTransitionCalculate = createLogic({
  type: mdTransitionActions.TRANSITION_CALCULATE,


});
 **/

/**
export const mdTransition = createLogic({
  type: mdTransitionActions.TRANSITION_ROUTE,
  cancelType: ['REGISTER_ROOT_CANCEL'],
  debounce: 0,
  throttle: 0,
  latest: false, //default
  transform({ getState, action }, next, reject) {
    console.log('transforming action = ', action);
    const state = getState();
    console.log('state = ', state);
    // next({type: 'NO_ACTION'});
    if (!elems.first) {
      elems.first = 'first';
      console.log('elems = ', elems);
      console.log('rejecting');
      next(action);
    } else {
      elems.second = 'second';
      console.log('elems = ', elems);
      console.log('sending');
      next({type: 'something!'});
    }

  },
  process({ getState, action }) {
    console.log('processing action = ', action);
    let state = getState();
    console.log('procssing, state = ', state);
    return action;
    return {
      type: 'GET_LOCATION',
      payload: 'none'
    }
  }
});
 **/


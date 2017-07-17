/* eslint-disable */
import { createLogic } from 'redux-logic';
import { user as types } from '../constants/ActionTypes';
import { Observable } from 'rxjs/Observable';
import Endpoints from '../constants/Endpoints';

const checkLoggedIn = createLogic({
  type: '*',
  transform: ({ getState, action }, next, reject) => {
    const state = getState();
    next(action);
    return;
    if (!state.user.loggedIn) {
      const { type } = action;
      if (type !== types.LOGIN && type !== types.LOGIN_PROCESSING && type !== types.LOGIN_REJECTED && type !== types.LOGIN_FULFILLED) {
        next({type: types.SHOW_LOGIN});
      }
    }
    next(action);
  }
});

const login = createLogic({
  type: types.LOGIN,
  transform({ getState, action }, next) {
    next({type: types.LOGIN_PROCESSING, payload: {...action.payload}});
  },
  process( { getState, action }, dispatch, done) {
    if (action.type === types.LOGIN_PROCESSING) {
      dispatch(
        Observable.ajax({
          url: Endpoints.usersLogin,
          method: 'POST',
          responseType: 'json',
          crossDomain: true,
          withCredentials: true,
          body: action.payload,
        }).map(resp => resp.response)
          .map(resp => {
            //console.log('resp = ', resp);
            return {
              type: types.LOGIN_FULFILLED,
              payload: resp,
            };
          }).catch(err => {
          console.log('CAUGHT ERROR!');
          console.log('err = ', err);
          return Observable.of({
            type: types.LOGIN_REJECTED,
            payload: err,
            error: true,
          });
        })
      );
    }
    //console.log('processing for action = ', action);
    done();
  }
});

const logout = createLogic({
  type: types.LOGOUT,
  process( { getState, action }, dispatch, done) {
    dispatch(
      Observable.ajax({
        url: Endpoints.usersLogout,
        method: 'POST',
        responseType: 'json',
        crossDomain: true,
        withCredentials: true,
        //body: action.payload,
      }).map(resp => resp.response)
        .map(resp => {
          console.log('resp = ', resp);
          return {
            type: types.LOGOUT_FULFILLED,
            payload: resp,
          };
        }).catch(err => {
        console.log('CAUGHT ERROR!');
        console.log('err = ', err);
        return Observable.of({
          type: types.LOGOUT_REJECTED,
          payload: err,
          error: true,
        });
      })
    );
    console.log('processing for action = ', action);
    done();
  }
});

const createUser = createLogic({
  type: types.CREATE,
  debounce: 1000,
  throttle: 0,
  latest: true, //default false,
  process( { getState, action }, dispatch, done) {
    dispatch(
      Observable.ajax({
        url: Endpoints.usersCreate,
        method: 'POST',
        responseType: 'json',
        crossDomain: true,
        withCredentials: true,
        body: action.payload,
      }).map(resp => resp.response)
        .map(resp => {
          console.log('resp = ', resp);
          return {
            type: types.CREATE_FULFILLED,
            payload: resp,
          };
        }).catch(err => {
        console.log('CAUGHT ERROR!');
        console.log('err = ', err);
        return Observable.of({
          type: types.CREATE_REJECTED,
          payload: err,
          error: true,
        });
      })
    );
    console.log('processing for action = ', action);
    done();
  }
});

const userEmailAvailable = createLogic({
  type: types.CHECK_EMAIL_AVAILABILITY,
  debounce: 2000,
  throttle: 0,
  latest: true, //default false,
  transform({ getState, action }, next, reject) {
    console.log('action = ', action);
    const {values, callback} = action.payload;
    console.log('middleware, values = ', values);
    console.log('middleware, callback = ', callback);
    Observable.ajax({
      url: Endpoints.usersAvailability,
      method: 'POST',
      responseType: 'json',
      crossDomain: true,
      withCredentials: true,
      body: values,
    }).map(resp => resp.response)
      .subscribe(
        (resp) => {
          callback(resp);
          reject();
        },
        () => {
          callback(null);
          reject();
        }
      );
  }
  /**
  process( { getState, action }, dispatch) {
    dispatch(
      Observable.ajax({
        url: 'http://pmt.dev/wp-json/sysapi/v1/users/available',
        method: 'POST',
        responseType: 'json',
        crossDomain: true,
        withCredentials: true,
        body: action.payload,
      }).map(resp => resp.response)
        .map(resp => {
        console.log('resp = ', resp);
        return {
          type: types.CHECK_AVAILABILITY_FULFILLED,
          payload: resp,
        };
      }).catch(err => {
        console.log('CAUGHT ERROR!');
        return Observable.of({
          type: types.CHECK_AVAILABILITY_REJECTED,
          payload: err,
          error: true,
        });
      })
    );
  }
   **/
});

const userUsernameAvailable = createLogic({
  type: types.CHECK_USERNAME_AVAILABILITY,
  debounce: 2000,
  throttle: 0,
  latest: true, //default false,
  transform({ getState, action }, next, reject) {
    console.log('action = ', action);
    const {values, callback} = action.payload;
    console.log('middleware, values = ', values);
    console.log('middleware, callback = ', callback);
    Observable.ajax({
      url: Endpoints.usersAvailability,
      method: 'POST',
      responseType: 'json',
      crossDomain: true,
      withCredentials: true,
      body: values,
    }).map(resp => resp.response)
      .subscribe(
        (resp) => {
          callback(resp);
          reject();
        },
        () => {
          callback(null);
          reject();
        }
      );
  }
  /**
   process( { getState, action }, dispatch) {
    dispatch(
      Observable.ajax({
        url: 'http://pmt.dev/wp-json/sysapi/v1/users/available',
        method: 'POST',
        responseType: 'json',
        crossDomain: true,
        withCredentials: true,
        body: action.payload,
      }).map(resp => resp.response)
        .map(resp => {
        console.log('resp = ', resp);
        return {
          type: types.CHECK_AVAILABILITY_FULFILLED,
          payload: resp,
        };
      }).catch(err => {
        console.log('CAUGHT ERROR!');
        return Observable.of({
          type: types.CHECK_AVAILABILITY_REJECTED,
          payload: err,
          error: true,
        });
      })
    );
  }
   **/
});

export default [checkLoggedIn, createUser, userEmailAvailable, userUsernameAvailable, login, logout];


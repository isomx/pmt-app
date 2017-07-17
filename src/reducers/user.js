import { user as types } from '../constants/ActionTypes';

const initState = {
  user: {},
  loggedIn: false,
  loggingIn: false,
  loginErrors: null,
  creating: false,
  createErrors: null,
}

export default function (state = {...initState}, action) {
  let newState, payload, errors;
  switch (action.type) {
    case types.CREATE_PROCESSING:
      newState = {...state, creating: true, createErrors: null};
      return newState;
    case types.CREATE_FULFILLED:
      newState = {...state, creating: false, createErrors: null};
      console.log('user reducer, create_fulfilled, action = ', action);
      if (action.payload.success) {
        newState.createResp = 'Success';
      } else if (action.payload.errors && action.payload.errors.length > 0) {
        newState.createResp = action.payload.errors[0];
      }
      return newState;
    case types.CREATE_REJECTED:
      newState = {...state, creating: false, createErrors: action.payload};
      return newState;
    case types.LOGIN_PROCESSING:
      newState = {...state, loggedIn: false, loggingIn: true, loginErrors: null, user: {}};
      return newState;
    case types.LOGIN_FULFILLED:
      payload = action.payload;
      //console.log('user reducer, payload = ', payload);
      if (!payload.errors && payload.success && payload.user) {
        newState = {...state, loggingIn: false, loginErrors: null, user: {...action.payload.user}, loggedIn: true}
        //console.log('new user state = ', newState);
      } else {
        if (!payload.errors || payload.errors.length < 0) {
          errors = ['Unable to login. Please try again.'];
        } else {
          errors = payload.errors;
        }
        newState = {...state, loggingIn: false, loginErrors: errors, user: {}, loggedIn: false};
      }
      return newState;
    case types.LOGIN_REJECTED:
      errors = action.payload.errors;
      if (!errors || errors.length < 0) {
        errors = ['There was a problem communicating with the server. Please try again.'];
      }
      newState = {...state, loggedIn: false, loggingIn: false, loginErrors: errors, user: {}};
      return newState;
    case types.SHOW_LOGIN:
      newState = {...state, loggedIn: false, loggingIn: false, user: {}, loginErrors: null};
      return newState;
    case types.LOGOUT:
      newState = {...state, loggedIn: false, loggingIn: false, user: {}, loginErrors: null};
      return newState;
    default:
      return state;
  }
}
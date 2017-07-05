import { push } from 'react-router-redux';
const routerLocationChange = '@@router/LOCATION_CHANGE';
/**
export const navTransitionIn = (dispatch) => {
  return (currLocation, toUrl, fromRect) => {
    const { pathname, state } = currLocation;
    const location = {
      pathname: toUrl,
      state: {
        [pathname]: state && state[pathname] ? {...state[pathname], [toUrl]: fromRect} : {[toUrl]: fromRect},
      }
    }
    dispatch(push(location));
  }
}

export const navTransitionIn = (url) => {
  return (dispatch, getState) => {
    console.log('getState = ', getState());
    dispatch(push(url));
  }
}
 **/
/**
export const navTransitionIn = (e, url) => (dispatch, getState) => {
  console.log('e.pageX = ', e.pageX);
  console.log('e.pageY = ', e.pageY);
  dispatch(push(url));
  setTimeout(() => {
    // dispatch(push(url));
  }, 1500);
  // dispatch({type: 'My Action', payload: {something: '123', something2: '456'}});
}
 **/

/**
export const toDashboard = {
  type: routerLocationChange,
  payload: {
    url: '/dashboard',
  }
}
 **/
export const toDashboard = push('/dashboard');
export const toFunnels = push('/funnels');

export const toRoute = (key) => {
  let action = {
    type: routerLocationChange,
    payload: {},
  };
  switch(key) {
    case 'dashboard':
      action.payload.url = '/dashboard';
      return action;
    default:
      action.payload.url = '/';
      return action;
  }
}

export const navTransitionIn = (e, url) => {
  console.log('e.pageX = ', e.pageX);
  console.log('e.pageY = ', e.pageY);
  return {
    type: '@@router/LOCATION_CHANGE',
    payload: 'SOMETHING'
  }
}
/* eslint-disable */
import { mdTransitionActions, navActions } from '../../../../actions/actionTypes';

/** Installed package, could be useful: https://github.com/sindresorhus/query-string **/

const convertToLocationObj = (locOrUrl) => {
  let location = Object.create(null);
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

export const routeTransition = (locOrUrl, anchor, sharedElems) => {
  const location = convertToLocationObj(locOrUrl);
  if (anchor) {
    if (anchor === true) {

    } else {
      //get anchor name
    }
  }
  if (sharedElems) {

  }
  return {

  }
}

const anchorOnly = (locOrUrl, anchor) => {
  const location = convertToLocationObj(locOrUrl);

}

const anchorAndSharedElement = (locOrUrl, anchor, sharedElems = []) => {
  const location = convertToLocationObj(locOrUrl);

}

const sharedElementOnly = (locOrUrl, sharedElem) => {
  const location = convertToLocationObj(locOrUrl);

}





/**
export const routeTransition = (e, locOrUrl, eventProps) => {
  console.log('e = ', e);
  let loc = {
    pathname: '/dashboard',
    state: {
      something: 'something1',
    }
  };
  history.push(loc);
  // return push(loc);


  return {
    type: mdTransitionActions.TRANSITION_ROUTE,
    payload: {
      event: e,
      location,
      eventProps,
    }
  }
}
 **/

export const appRouteTransition = (locOrUrl, parentIds) => {
  let location = Object.create(null);
  if (typeof locOrUrl === 'string') {
    const parts = locOrUrl.split('?');
    location.pathname = parts[0];
    if (parts[1]) {
      location.search = '?' + parts[1];
    }
  } else {
    location = locOrUrl;
  }
  location.state = {
    mdTransition: {
      id: parentIds[parentIds.length - 1],
      parentIds,
    },
  };
  // location.state.actionType = mdTransitionActions.APP_ROUTE_TRANSITION;
  return {
    type: mdTransitionActions.APP_ROUTE_TRANSITION,
    payload: location,
  }
}
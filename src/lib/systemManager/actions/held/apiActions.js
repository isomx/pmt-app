import actionTypes from '../actionTypes';

let apiHandler;
export const registerApiHandler = (fn) => {
  apiHandler = fn;
}

export const apiActions = {
  dispatchToParentGroup: (action, name) => {
    apiHandler({
      type: actionTypes.API.DISPATCH_TO_PARENT_GROUP,
      payload: {
        action,
        name,
      }
    });
  },
}

import { renderActions } from './actionTypes';

export const loadData = (dispatch) => {
  return (pathname) => {
    dispatch({
      type: renderActions.LOAD_DATA,
      payload: {
        route: pathname
      }
    });
  };
};

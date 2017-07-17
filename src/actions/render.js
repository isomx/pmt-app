import { renderActions } from '../constants/ActionTypes';

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

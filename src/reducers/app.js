import { render } from '../constants/ActionTypes';

const getInitState = () => ({
  processing: false,
  errors: null,
  renderAs: null,
  pageId: null,
})

export default function (state = getInitState(), action) {
  let newState;
  switch (action.type) {
    case render.LOAD_DATA_PROCESSING:
      newState = {...state, processing: true, errors: null};
      return newState;
    case render.LOAD_DATA_FULFILLED:
      newState = {...state, processing: false, errors: null}
      return newState;
    default:
      return state;
  }
}
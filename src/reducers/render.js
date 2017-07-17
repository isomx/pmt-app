import { render } from '../constants/ActionTypes';

const initState = {
  dataFlat: null,
  dataTree: null,
  pageId: null,
  renderAs: null,
  errors: null,
  processing: true,
}

export default function (state = initState, action) {
  let newState;
  switch (action.type) {
    case render.LOAD_DATA_PROCESSING:
      newState = {...state, processing: true, errors: null};
      return newState;
    case render.LOAD_DATA_FULFILLED:
      newState = {...state, processing: false, errors: null, dataFlat: action.payload.dataFlat};
      return newState;
    case render.LOAD_DATA_REJECTED:
      newState = {...state, processing: false, errors: action.payload.errors};
      return newState;
    default:
      return state;
  }
}
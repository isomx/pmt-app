import Rx from 'rxjs';
import { getUniqueId } from './helpers';
import { zoomPanActionTypes as actionTypes } from '../actions/actionTypes';

const elems$ = new Rx.BehaviorSubject({});

const connectComponent = ({ receiveDispatch }) => {
  let elems = elems$.getValue();
  const id = getUniqueId();
  elems[id] = {
    id,
    receiveDispatch,
  };
  elems$.next(elems);
  return id;
}

const disconnectComponent = (id) => {
  let elems = elems$.getValue();
  if (elems[id]) {
    delete elems[id];
    elems$.next(elems);
  }
}

export const correctElemRect = (zoomPanId) => {
  const elems = elems$.getValue();
  let resp = null;
  if (elems[zoomPanId]) {
    resp = elems[zoomPanId].receiveDispatch({
      type: actionTypes.CORRECT_ELEM_RECT
    });
    console.log('resp = ', resp);
  }
  return resp;
}

export const zoomPanDispatch = (action) => {
  const { payload } = action;
  switch(action.type) {
    case actionTypes.CONNECT_COMPONENT:
      return connectComponent(payload);
    case actionTypes.DISCONNECT_COMPONENT:
      disconnectComponent(payload.id);
      break;
    default:

  }
}
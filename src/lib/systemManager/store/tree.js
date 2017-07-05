/* eslint-disable */
import Rx from 'rxjs';
import { getUniqueId, removeElemAndChildren, removeElemsAndChildren } from './helpers';
import { treeActionTypes as actionTypes } from '../actions/actionTypes';

const elems$ = new Rx.BehaviorSubject({});

let _addBodyElements, _removeBodyElements, sysMgrId;

export const connectSystemManager = (id, addBodyElements, removeBodyElements, receiveDispatch) => {
  _addBodyElements = addBodyElements;
  _removeBodyElements = removeBodyElements;
  let elems = elems$.getValue();
  sysMgrId = id;
  elems[sysMgrId] = {
    id: sysMgrId,
    parentId: 0,
    name: 'systemManager__tree',
    type: 'systemManager',
    childIds: [],
    path: '',
    receiveDispatch: receiveDispatch,
  };
  elems$.next(elems);
}

const connectComponent = ({ type, parentId, receiveDispatch, name }) => {
  let elems = elems$.getValue();
  const id = getUniqueId();
  elems[id] = {
    id,
    parentId,
    name: type + '__' + name,
    type,
    receiveDispatch,
    childIds: [],
    path: elems[parentId].path + parentId + '||',
  };
  elems[parentId].childIds.push(id);
  elems$.next(elems);
  return id;
}

const disconnectComponent = (id) => {
  let elems = elems$.getValue();
  if (elems[id]) {
    removeElemAndChildren(elems, id, true);
    elems$.next(elems);
  }
}

export const treeDispatch = (action) => {
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
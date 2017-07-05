import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import { getUniqueId, removeElemAndChildren, removeElemsAndChildren } from './helpers';
import { handleTransitions } from '../services/transitions/manager';
import { actionTypes } from '../actions/actionTypes';
import { transitionTypes } from '../actions/transitionTypes';

const elems$ = new BehaviorSubject({});
const positions$ = new BehaviorSubject({});

let groupUpdateInProgress$, _addBodyElements, _removeBodyElements, sysMgrId;

export const connectSystemManager = (id, addBodyElements, removeBodyElements, receiveDispatch) => {
  _addBodyElements = addBodyElements;
  _removeBodyElements = removeBodyElements;
  let elems = elems$.getValue();
  sysMgrId = id;
  elems[sysMgrId] = {
    id: sysMgrId,
    parentId: 0,
    name: 'systemManager__transitions',
    type: 'systemManager',
    childIds: [],
    path: '',
    receiveDispatch: receiveDispatch,
  };
  elems$.next(elems);
}

const connectComponent = ({ type, parentId, receiveDispatch, name, zoomPanId }) => {
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
    zoomPanId,
  };
  elems[parentId].childIds.push(id);
  elems$.next(elems);
  return id;
}

const connectBodyElement = (id, receiveDispatch) => {
  if (!id || !receiveDispatch) return;
  let elems = elems$.getValue();
  elems[id].receiveDispatch = receiveDispatch;
  elems$.next(elems);
}

const disconnectComponent = (id) => {
  let elems = elems$.getValue();
  if (elems[id]) {
    removeElemAndChildren(elems, id, true);
    elems$.next(elems);
  }
}

const recordPosition = (id) => {
  const elems = elems$.getValue();
  if (!elems[id]) return;
  /**
   * IMPORTANT! Key off of top->down path, vs. down->up, because then you can make sure
   * you associate a commonElement with its most direct parent anchor, since the anchor
   * that comes last (that has the commonElement as a child) will win
   **/
  let path = elems[id].path.split('||');
  path.splice(path.length - 1, 1); //always going to have an empty ending, since path ends in ||
  let position = {
    path,
    anchors: {
      names: [],
      ids: [],
    },
    commonElements: {
      names: [],
      ids: [],
    },
    names: [],
    types: [],
  };
  let val;
  let childVal;
  for (let i = 0; i < path.length; i++) {
    val = elems[path[i]];
    position.names.push(val.name);
    position.types.push(val.type);
    if (val.type === 'anchor') {
      position.anchors.names.push(val.name);
      position.anchors.ids.push(val.id);
      if (val.childIds.length > 0) {
        for (let ii = 0; ii < val.childIds.length; ii++) {
          childVal = elems[val.childIds[ii]];
          if (childVal.type === 'commonElement') {
            // ok to override existing commonElement, since this current anchor is more
            // direct to the commonElement than any preceding anchors since you're using
            // a top->down path
            position.commonElements.names.push(childVal.name);
            position.commonElements.ids.push(childVal.id);
          }
        }
      }
    } else if (val.type === 'commonElement') {
      // Don't override a common element already added by an anchor
      position.commonElements.names.push(val.name);
      position.commonElements.ids.push(val.ids);
    }
  }
  positions$.next(position);
}

const startGroupUpdate = (id) => {
  let toTransition = {
    idsToLeave: [],
    idsToEnter: [],
    idsToAppear: [],
    transTypes: {
      surfaceExpand: [],
      surfaceMorph: [],
      crossFade: [],
    },
    groupUpdate$: [],
    recordedPosition: positions$.getValue(),
  };
  const updater$ = Observable.create((observer) => {
    groupUpdateInProgress$ = observer;
  });

  const compile$ = updater$
    .map((act) => {
      if (act.type === actionTypes.GROUP_DID_UPDATE) {
        toTransition[act.payload.id] = {
          id: act.payload.id,
          transitionType: act.payload.transitionType,
          handleUpdate: act.payload.handleUpdate,
          idsToEnter: act.payload.idsToEnter,
          idsToLeave: act.payload.idsToLeave,
          idsToAppear: act.payload.idsToAppear,
        };
        toTransition.groupUpdate$.push(act.payload.handleUpdate);
        toTransition.idsToLeave.push(...act.payload.idsToLeave);
        toTransition.idsToEnter.push(...act.payload.idsToEnter);
        toTransition.idsToAppear.push(...act.payload.idsToAppear);
        switch(act.payload.transitionType) {
          case transitionTypes.SURFACE_EXPAND:
            toTransition.transTypes.surfaceExpand.push(act.payload.id);
            break;
          case transitionTypes.SURFACE_MORPH:
            toTransition.transTypes.surfaceMorph.push(act.payload.id);
            break;
          case transitionTypes.CROSS_FADE:
            toTransition.transTypes.crossFade.push(act.payload.id);
            break;
          default:
        }
      }
      return act;
    })
    .takeWhile((act) => act.type === actionTypes.GROUP_DID_UPDATE && act.payload.id === id ? false : true);

  compile$.subscribe(null, null,
    () => {
      groupUpdateInProgress$.complete();
      groupUpdateInProgress$ = null;
      positions$.next(null);
      if (toTransition.idsToLeave.length > 0 || toTransition.idsToEnter.length > 0 || toTransition.idsToAppear.length > 0) {
        toTransition.allElems = elems$.getValue();
        toTransition.activeElems = toTransition.idsToLeave.length > 0 ? removeElemsAndChildren(toTransition.allElems, toTransition.idsToLeave) : toTransition.allElems;
        const transition$ = handleTransitions(toTransition);
        transition$.subscribe(null, null,
          () => {
            console.log('transition$ subscribe complete');
          }
        );
      }
    }
  );
}

export const transitionsDispatch = (action) => {
  const { payload } = action;
  switch(action.type) {
    case actionTypes.BODY_ELEMENT_CONNECT:
      connectBodyElement(payload.id, payload.receiveDispatch);
      break;
    case actionTypes.CONNECT_COMPONENT:
      return connectComponent(payload);
    case actionTypes.DISCONNECT_COMPONENT:
      disconnectComponent(payload.id);
      break;
    case actionTypes.EVENT_RECORD_POSITION:
      recordPosition(payload.id);
      break;
    case actionTypes.GROUP_WILL_UPDATE:
      if (!groupUpdateInProgress$) startGroupUpdate(payload.id);
      groupUpdateInProgress$.next(action);
      break;
    case actionTypes.GROUP_DID_UPDATE:
      if (groupUpdateInProgress$) groupUpdateInProgress$.next(action);
      break;
    default:

  }
}

export const addBodyElements = (elems) => {
  let store = elems$.getValue();
  let elemData, newElems = {};
  let newIds = [];
  for (let i = 0; i < elems.length; i++) {
    elemData = elems[i];
    const id = getUniqueId();
    store[id] = {
      id,
      parentId: sysMgrId,
      name: 'bodyElement__' + id,
      type: 'bodyElement',
      childIds: [],
      path: store[sysMgrId].path + sysMgrId + '||',
    };
    store[sysMgrId].childIds.push(id);
    elems$.next(store);
    elemData.storeId = id;
    elemData.key = 'bodyElement__' + id;
    elemData.dispatch = transitionsDispatch;
    newElems[id] = elemData;
    newIds.push(id);
  }
  const resp = _addBodyElements(newElems);
  return resp ? {ids: newIds, add$: resp} : null;
}

export const removeBodyElements = (ids) => {
  return _removeBodyElements(ids);
}



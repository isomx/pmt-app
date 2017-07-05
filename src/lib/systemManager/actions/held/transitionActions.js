import Rx from 'rxjs/Rx';
import uniqueId from 'lodash/uniqueId';

const store$ = new Rx.BehaviorSubject({});

export const logicActions = {
  getStore: () => store$.getValue(),
}

export const connectActions = {
  connect: (callback) => {
    let id = uniqueId();
    Rx.Observable.create((observer) => {
      let elems = store$.getValue();
      elems[id] = {
        id,
        parentId: 0,
        callback,
      };
      observer.next(id);
      store$.next(elems);
      observer.complete();
    }).subscribe(callback({type: 'connect'}));
  },
};

let anchorElem;
export const groupActions = {
  connect: (parentId, callback, name) => {
    const id = uniqueId();
    let elems = store$.getValue();
    Rx.Observable.create((observer) => {
      elems[id] = {
        id,
        parentId,
        callback,
        type: 'group',
        name,
      };
      store$.next(elems);
      observer.next(elems[id]);
      observer.complete();
    })
      .let(elems[parentId].callback({type: 'addChild'}))
      .subscribe(callback({type: 'connect'}));
  },
  getAnchorElem: () => {
    const ele = anchorElem;
    anchorElem = null;
    return ele;
  },
  getStore: () => store$.getValue(),
};

export const groupChildActions = {
  connect: (parentId, callback, key, name) => {
    const id = uniqueId();
    let elems = store$.getValue();
    Rx.Observable.create((observer) => {
      elems[id] = {
        id,
        parentId,
        callback,
        type: 'groupChild',
        key,
        name,
      };
      observer.next(elems[id]);
      observer.complete();
    })
      .let(elems[parentId].callback({type: 'addChild'}))
      .subscribe(callback({type: 'connect'}));
  },
};

export const anchorActions = {
  connect: (parentId, callback, name) => {
    const id = uniqueId();
    let elems = store$.getValue();
    Rx.Observable.create((observer) => {
      elems[id] = {
        id,
        parentId,
        callback,
        type: 'anchor',
        name,
      };
      store$.next(elems);
      anchorElem = elems[id];
      observer.next(elems[id]);
      observer.complete();
    })
      .let(elems[parentId].callback({type: 'addChild'}))
      .subscribe(callback({type: 'connect'}));
  },
};

export const commonElementActions = {
  connect: (parentId, callback, name) => {
    const id = uniqueId();
    let elems = store$.getValue();
    Rx.Observable.create((observer) => {
      elems[id] = {
        id,
        parentId,
        callback,
        type: 'commonElement',
        name,
      };
      store$.next(elems);
      observer.next(elems[id]);
      observer.complete();
    })
      .let(elems[parentId].callback({type: 'addChild'}))
      .subscribe(callback({type: 'connect'}));
  },
};

export const transitionEventActions = (action) => {
  const elems = store$.getValue();
  const parentId = action.payload.parentId;
  if (!parentId) return;
  switch(action.type) {
    case 'dispatchToParentGroup':
      action.payload = {
        parentIds: [],
      };
      action.payload.store = elems;
      if (elems[parentId]) {
        elems[parentId].callback(action);
      }
      break;
    case 'routeTransition':
      if (!action.payload.locOrUrl || !action.payload.transitionType) return;
      action.payload = {
        parentIds: [],
        store: elems,
        locOrUrl: action.payload.locOrUrl,
        transitionType: action.payload.transitionType,
        commonElement: action.payload.commonElement,
      };
      elems[parentId].callback(action);
      break;
    default:
  }
}

const assembleParents = (id, store, parents = []) => {
  parents.push(id);
  if (store[id] && (store[id].parentId || store[id].parentId === 0)) {
    assembleParents(store[id].parentId, store, parents);
  } else {
    return parents;
  }
}


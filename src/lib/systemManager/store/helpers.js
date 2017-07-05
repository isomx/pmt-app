import uniqueId from 'lodash/uniqueId';

export const getUniqueId = () => {
  return uniqueId();
}

export const removeElemAndChildren = (store, id, mutate = false, firstRun = true) => {
  if (!mutate) {
    store = {...store};
  }
  if (!store[id]) return store;
  let childIds = store[id].childIds;
  if (childIds && childIds.length > 0) {
    for (let i = 0; i < childIds.length; i++) {
      removeElemAndChildren(store, childIds[i], true, false);
    }
  }
  if (firstRun) {
    //only remove from childIds array of parent if first run, all the rest will be deleted when the key is deleted
    const pElem = store[store[id].parentId];
    if (pElem && pElem.childIds) {
      const cIndex = pElem.childIds.indexOf(id);
      if (cIndex > -1) {
        if (!mutate) {
          store[pElem.id] = {...pElem, childIds: [].concat(pElem.childIds)};
        }
        store[pElem.id].childIds.splice(cIndex, 1);
      }
    }
  }
  delete store[id];
  return store;
}

export const removeElemsAndChildren = (store, ids, mutate = false, firstRun = true) => {
  if (!mutate) {
    store = {...store};
  }
  for (let i = 0; i < ids.length; i++) {
    if (firstRun && !mutate) {
      const pElem = store[store[ids[i]]] ? store[store[ids[i]].parentId] : null;
      if (pElem && pElem.childIds) {
        store[pElem.id] = {...pElem, childIds: [].concat(pElem.childIds)};
      }
    }
    store = removeElemAndChildren(store, ids[i], true, firstRun);
    firstRun = false;
  }
  return store;
}


export const convertElemPathToNames = (elems, pathString, returnArray = true) => {
  const path = pathString.split('||');
  path.splice(path.length - 1, 1); //always going to have an empty ending, since path ends in ||
  let names = [];
  for (let i = 0; i < path.length; i++) {
    if (elems[path[i]]) {
      names.push(elems[path[i]].name);
    }
  }
  return returnArray ? names : names.join('||') + '||';
}

export const getElemTypesInPath = (storeElems, pathString, idsOnly = false, reverse = false) => {
  const path = pathString.split('||');
  path.splice(path.length - 1, 1); //always going to have an empty ending, since path ends in ||
  let found = {};
  for (let i = 0; i < path.length; i++) {
    if (!found[storeElems[path[i]].type]) found[storeElems[path[i]].type] = [];
    if (reverse) {
      if (idsOnly) {
        found[storeElems[path[i]].type].unshift(storeElems[path[i]].id);
      } else {
        found[storeElems[path[i]].type].unshift(storeElems[path[i]]);
      }
    } else {
      if (idsOnly) {
        found[storeElems[path[i]].type].push(storeElems[path[i]].id);
      } else {
        found[storeElems[path[i]].type].push(storeElems[path[i]]);
      }
    }
  }
  return found;
}

const _getElemTypesOfChildren = (storeElems, id, idsOnly = false, found = {}) => {
  const elem = storeElems[id];
  if (!elem) return found;
  if (!found[elem.type]) found[elem.type] = [];
  if (idsOnly) {
    found[elem.type].push(elem.id);
  } else {
    found[elem.type].push(elem);
  }
  if (elem.childIds && elem.childIds.length > 0) {
    for (let i = 0; i < elem.childIds.length; i++) {
      found = _getElemTypesOfChildren(storeElems, elem.childIds[i], idsOnly, found);
    }
  }
  return found;
}

export const getElemTypesOfChildren = (storeElems, id, idsOnly = false) => {
  let found = {};
  const elem = storeElems[id];
  if (!elem || !elem.childIds) return found;
  for (let i = 0; i < elem.childIds.length; i++) {
    found = _getElemTypesOfChildren(storeElems, elem.childIds[i], idsOnly, found);
  }
  return found;
}
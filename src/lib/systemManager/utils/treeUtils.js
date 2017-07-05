import forOwn from 'lodash/forOwn';

export function convertToTree(data, options) {
  options = options || {};
  const ID_KEY = options.idKey || 'id';
  const PARENT_KEY = options.parentKey || 'parentId';
  const CHILDREN_KEY = options.childrenKey || 'childNodes';
  const TOP_LEVEL_ID = options.topLevelId || null;
  let tree = [],
    childrenOf = {};
  let item, id, parentId;

  forOwn(data, (val, key) => {
    item = val;
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    // every item may have children
    childrenOf[id] = childrenOf[id] || [];
    // init its children
    item[CHILDREN_KEY] = childrenOf[id];
    if (parentId === 0) {
      tree.push(item);
    } else {
      // init its parent's children object
      childrenOf[parentId] = childrenOf[parentId] || [];
      // push it into its parent's children object
      childrenOf[parentId].push(item);
    }
  });
  if (TOP_LEVEL_ID) {
    return filterTreeForId(TOP_LEVEL_ID, tree);
  }

  return tree;
}

export function filterTreeForId (id, tree) {
  for (let i in tree) {
    if (tree.hasOwnProperty(i)) {
      if (tree[i].id === id) {
        return tree[i];
      } else {
        return filterTreeForId(id, tree[i].childNodes);
      }
    }
  }
  return null;
}
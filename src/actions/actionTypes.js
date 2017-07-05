export const navActions = Object.freeze({
  LOCATION_CHANGE: '@@router/LOCATION_CHANGE',
  CALL_HISTORY_METHOD: '@@router/CALL_HISTORY_METHOD',
});

export const treeActions = Object.freeze({
  GET_GROUPS_REQUEST: 'TREE_GET_GROUPS_REQUEST',
});

export const mdTransitionActions = Object.freeze({
  TRANSITION_ROUTE: 'MD_TRANSITION_ROUTE',
  APP_ROUTE_TRANSITION: 'MD_APP_ROUTE_TRANSITION',
});

export const renderActions = Object.freeze({
  LOAD_DATA: 'RENDER_LOAD_DATA',
  LOAD_DATA_CANCEL: 'RENDER_LOAD_DATA_CANCEL',
  DATA_LOADING: 'RENDER_DATA_LOADING',
  DATA_LOADED: 'RENDER_DATA_LOADED',
});
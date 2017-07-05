/* eslint-disable */
import { createLogic } from 'redux-logic';
import { renderActions } from '../actions/actionTypes';
import forOwn from 'lodash/forOwn';
import forEach from 'lodash/forEach';
import { getComponent } from '../components';

function convertToTree(data, options) {
  options = options || {};
  const ID_KEY = 'id';
  const PARENT_KEY = 'parentId';
  const CHILDREN_KEY = 'children';
  const PROPS_STREAM_KEY = 'mapPropsStream';
  let tree = [],
    childrenOf = {},
    mapPropsStream = {};
  let item, id, parentId;
  forEach(data, (val, key) => {
    item = val;
    item.component = getComponent(item);
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    // every item may have children
    childrenOf[id] = childrenOf[id] || [];

    // init its parent's mapPropsStream object
    mapPropsStream[parentId] = mapPropsStream[parentId] || {};

    // every item may have props injected into it
    mapPropsStream[id] = {...mapPropsStream[parentId]} || {};
    // init its children
    item[CHILDREN_KEY] = childrenOf[id];
    // init its prop stream
    item[PROPS_STREAM_KEY] = mapPropsStream[id];
    if (parentId === 0) {
      tree.push(item);
    } else {
      // init its parent's children object
      childrenOf[parentId] = childrenOf[parentId] || [];
      // push it into its parent's children object
      childrenOf[parentId].push(item);

      if (item.name === 'Form') {
        mapPropsStream[id].TextField = ['Do Something'];
      } else if (item.name === 'TextField') {
        mapPropsStream[id].div = ['Div Props Stream'];
      }
      //console.log('childrenOf parentId ' + parentId + ' = ', childrenOf[parentId]);
    }
  });
  return tree;
}

export const renderLoadData = createLogic({
  type: renderActions.LOAD_DATA,
  cancelType: renderActions.LOAD_DATA_CANCEL,
  debounce: 0,
  throttle: 0,
  latest: true, //default
  transform({ getState, action }, next, reject) {
    // console.log('renderLoadData middleware, getState = ', getState());
    // console.log('renderLoadData middleware, action = ', action);
    action.payload = {
      route: 'something',
    }
    //reject();
    next(action);
  },
  process({ getState, action }, dispatch, done) {
    // console.log('renderLoadData processing action = ', action);
    // console.log('renderLoadData PROCESSING STATE = ', getState());
    setTimeout(() => {
      let ac = {
        type: renderActions.DATA_LOADED,
        payload: 'RESP GOES HERE',
      };
      dispatch(ac);
      done();
    }, 500);

  }
});

export const renderDataLoaded = createLogic({
  type: renderActions.DATA_LOADED,
  cancelType: renderActions.LOAD_DATA_CANCEL,
  debounce: 0,
  throttle: 0,
  latest: true, //default
  transform({ getState, action }, next, reject) {
    // console.log('renderDataLoaded middleware, getState = ', getState());
    // console.log('renderDataLoaded middleware, action = ', action);
    const data = {
      '/login': [{
        id: 1,
        parentId: 0,
        name: 'div',
        type: 'domElem',
      }, {
        id: 2,
        parentId: 1,
        name: 'Form',
        type: 'container',
      }, {
        id: 3,
        parentId: 2,
        name: 'div',
        type: 'domElem',
      }, {
        id: 4,
        parentId: 3,
        name: 'TextField',
        type: 'component',
      }, {
        id: 5,
        parentId: 2,
        name: 'div',
        type: 'domElem',
      }, {
        id: 6,
        parentId: 5,
        name: 'TextField',
        type: 'component',
      }]
    };
    const tree = convertToTree(data['/login']);
    console.log('tree = ', tree);
    //reject();
    const ac = {
      type: renderActions.DATA_LOADED,
      payload: {
        '/login': tree
      },
    }
    next(ac);
  },
  process({ getState, action }, dispatch, done) {
    // console.log('renderDataLoaded processing action = ', action);
    // console.log('renderDataLoaded PROCESSING STATE = ', getState());
    done();
  }
});

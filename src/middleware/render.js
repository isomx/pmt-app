/* eslint-disable */
import { createLogic } from 'redux-logic';
import { render as renderActions } from '../constants/ActionTypes';
import { Observable } from 'rxjs/Observable';
import forOwn from 'lodash/forOwn';
import forEach from 'lodash/forEach';
import components from '../components';
import endpoints from '../constants/Endpoints';

function convertToTree(data, options) {
  options = options || {};
  const ID_KEY = 'id';
  const PARENT_KEY = 'parentId';
  const CHILDREN_KEY = 'children';
  const PROPS_STREAM_KEY = 'mapProps$';
  let tree = [],
    childrenOf = {},
    mapPropsStream = {};
  let item, id, parentId;
  forEach(data, (val, key) => {
    item = val;
    item.component = components[val.key];
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

      /**
      if (item.name === 'Form') {
        mapPropsStream[id].TextField = ['Do Something'];
      } else if (item.name === 'TextField') {
        mapPropsStream[id].div = ['Div Props Stream'];
      }
       **/
      //console.log('childrenOf parentId ' + parentId + ' = ', childrenOf[parentId]);
    }
  });
  return tree;
}

const dataFlat = {1: [
  {
    id: 1,
    parentId: 0,
    key: 'MdGrid',
    type: 'grid',
    props: {
      margin: 40,
      gutter: 24,
      style: {minHeight: '350px'},
    }
  }, {
    id: 2,
    parentId: 0,
    key: 'MdGrid',
    type: 'grid',
    props: {
      margin: 40,
      gutter: 24,
      style: {minHeight: '100px'},
    }
  }
]};
const loadData = createLogic({
  type: renderActions.LOAD_DATA,
  transform({ getState, action }, next) {
    console.log('loadData getState = ', getState());
    next({type: renderActions.LOAD_DATA_PROCESSING});
  },
  process({ getState, action }, dispatch, done) {
    if (action.type === renderActions.LOAD_DATA_PROCESSING) {
      dispatch(
        Observable.ajax({
          url: endpoints.pagesNodes,
          method: 'GET',
          responseType: 'json',
          crossDomain: true,
          withCredentials: true,
        })
          .map(data => data.response)
          .map(resp => {
            console.log('loadData middleware, resp = ', resp);

            return {type: renderActions.LOAD_DATA_FULFILLED, payload: {dataFlat}}
          })
          .catch(err => {
            console.log('CAUGHT ERROR LOADING DATA. Err = ', err);
            return Observable.of({
              type: renderActions.LOAD_DATA_REJECTED,
              payload: err,
              error: true,
            })
          })
      );
      done();
    }
  }
});

const loadDataFulfilled = createLogic({
  type: renderActions.LOAD_DATA_FULFILLED,
  transform({ getState, action }, next, reject) {
    const { payload } = action;
    console.log('fulfilled reducer, payload = ', action.payload);


    const dataTree = convertToTree(payload.dataFlat);
    console.log('dataTree = ', dataTree);
    reject();
  }
})

const moveComponent = createLogic({
  type: renderActions.MOVE_COMPONENT,
  debounce: 0,
  throttle: 0,
  latest: true,
  transform({ getState, action}, next) {
    next(action);
  }
});

export default [loadData, loadDataFulfilled, moveComponent]


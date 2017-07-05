/*eslint-disable*/
import { treeActions } from '../actions/actionTypes';

export default function (state = {}, action) {
  switch(action.type) {
    case treeActions.GET_GROUPS_REQUEST:
      //console.log('TreeReducer -> state = ', state);
      //console.log('TreeReducer -> action', action);
      //state = {...state, treeData: action.payload.treeData, tree: action.payload.tree, codeData: action.payload.codeData};
      state = {...state, ...action.payload};
      break;
    case 'E':
      //throw new Error('Error!!');
      break;
  }
  return state;
};
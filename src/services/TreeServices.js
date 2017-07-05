/**
 * Created by Josh on 3/30/2017.
 */
/*eslint-disable*/
import { treeActions } from "../actions/actionTypes";
const collectionData = {"group":{"1":{"id":1,"parentId":0,"name":"Select Main Category","description":"Every person starts here, it is the top group","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":true,"code":2,"codeType":"group","groupData":null,"entrances":[]},"171":{"id":171,"parentId":1,"name":"Test 1 - Standard Group","description":"standard group 1 description","displayToUser":0,"displayName":"Display TO User","displayIcon":"fa-bell-slash","groupPoints":31,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[192]},"184":{"id":184,"parentId":171,"name":"Standard group 4","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"182":{"id":182,"parentId":184,"name":"New Group 1","description":"","displayToUser":0,"displayName":"My First Feedb","displayIcon":"fa-code-fork","groupPoints":123,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[]},"190":{"id":190,"parentId":184,"name":"Test Transfer Group","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":3,"codeType":"group","groupData":{"targetGroupId":"1"},"entrances":[]}},"type":[]};
const appData = {"group":{"1":{"id":1,"parentId":0,"name":"Select Main Category","description":"Every person starts here, it is the top group","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":true,"code":2,"codeType":"group","groupData":null,"entrances":[]},"171":{"id":171,"parentId":1,"name":"Testing user's personality type","description":"One of: Anlytical, Emotional","displayToUser":1,"displayName":"Display To User","displayIcon":"fa-crop","groupPoints":31,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[192]},"184":{"id":184,"parentId":171,"name":"Find out if user has opened my latest email","description":"Email description: Buy Emotional Peace System","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"190":{"id":190,"parentId":171,"name":"Want the user to re-do the questions","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":3,"codeType":"group","groupData":{"returnGroupId":"171","targetGroupId":"1"},"entrances":[326]},"192":{"id":192,"parentId":171,"name":"New Group 45","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"193":{"id":193,"parentId":171,"name":"New group 6","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"194":{"id":194,"parentId":171,"name":"New Group 7","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]}},"type":[]};
const groupData = {"group":{"1":{"id":1,"parentId":0,"name":"Select Main Category","description":"Every person starts here, it is the top group","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":true,"code":2,"codeType":"group","groupData":null,"entrances":[]},"171":{"id":171,"parentId":1,"name":"Testing user's personality type","description":"One of: Anlytical, Emotional","displayToUser":1,"displayName":"Display To User","displayIcon":"fa-crop","groupPoints":31,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[192]},"184":{"id":184,"parentId":171,"name":"Find out if user has opened my latest email","description":"Email description: Buy Emotional Peace System","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"190":{"id":190,"parentId":171,"name":"Want the user to re-do the questions","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":3,"codeType":"group","groupData":{"returnGroupId":"171","targetGroupId":"1"},"entrances":[326]},"192":{"id":192,"parentId":190,"name":"New Group 45","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[]},"198":{"id":198,"parentId":192,"name":"asdfasdf","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"199":{"id":199,"parentId":192,"name":"asdfasdf","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"193":{"id":193,"parentId":171,"name":"New group 6","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"194":{"id":194,"parentId":171,"name":"New Group 7","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"195":{"id":195,"parentId":171,"name":"New Gruop 8","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"196":{"id":196,"parentId":171,"name":"New Group 9","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"197":{"id":197,"parentId":171,"name":"New Group 10","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]}},"type":[]};
const typeData = {"group":{"1":{"id":1,"parentId":0,"name":"Select Main Category","description":"Every person starts here, it is the top group","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":true,"code":2,"codeType":"group","groupData":null,"entrances":[]},"171":{"id":171,"parentId":1,"name":"Testing user's personality type","description":"One of: Anlytical, Emotional","displayToUser":1,"displayName":"Display To User","displayIcon":"fa-crop","groupPoints":31,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[192]},"184":{"id":184,"parentId":171,"name":"Find out if user has opened my latest email","description":"Email description: Buy Emotional Peace System","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"190":{"id":190,"parentId":171,"name":"Want the user to re-do the questions","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":3,"codeType":"group","groupData":{"returnGroupId":"171","targetGroupId":"1"},"entrances":[326]},"192":{"id":192,"parentId":190,"name":"New Group 45","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[392]},"198":{"id":198,"parentId":192,"name":"asdfasdf","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"203":{"id":203,"parentId":198,"name":"ST Group 7","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[397]},"204":{"id":204,"parentId":198,"name":"ST Group 8","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[397]},"199":{"id":199,"parentId":192,"name":"asdfasdf","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"202":{"id":202,"parentId":192,"name":"ST Group 4","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"200":{"id":200,"parentId":190,"name":"Standard Group New 1","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[392]},"201":{"id":201,"parentId":190,"name":"Standard Group New 2","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[392]},"193":{"id":193,"parentId":171,"name":"New group 6","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"194":{"id":194,"parentId":171,"name":"New Group 7","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"195":{"id":195,"parentId":171,"name":"New Gruop 8","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"196":{"id":196,"parentId":171,"name":"New Group 9","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"197":{"id":197,"parentId":171,"name":"New Group 10","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]}},"type":[]};
//const editData = {"group":{"1":{"id":1,"parentId":0,"name":"Select Main Category","description":"Every person starts here, it is the top group","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":true,"code":2,"codeType":"group","groupData":null,"entrances":[]},"171":{"id":171,"parentId":1,"name":"Testing user's personality type","description":"One of: Anlytical, Emotional","displayToUser":1,"displayName":"Display To User","displayIcon":"fa-crop","groupPoints":31,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[192]},"184":{"id":184,"parentId":171,"name":"Find out if user has opened my latest email","description":"Email description: Buy Emotional Peace System","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"190":{"id":190,"parentId":171,"name":"Want the user to re-do the questions","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":3,"codeType":"group","groupData":{"returnGroupId":"171","targetGroupId":"1"},"entrances":[326]},"192":{"id":192,"parentId":190,"name":"New Group 45","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[392]},"198":{"id":198,"parentId":192,"name":"asdfasdf","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"203":{"id":203,"parentId":198,"name":"ST Group 7","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[397]},"204":{"id":204,"parentId":198,"name":"ST Group 8","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[397]},"199":{"id":199,"parentId":192,"name":"asdfasdf","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":3,"codeType":"group","groupData":{"returnGroupId":"194","targetGroupId":"198"},"entrances":[389]},"202":{"id":202,"parentId":192,"name":"ST Group 4","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[389]},"200":{"id":200,"parentId":190,"name":"Standard Group New 1","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[392]},"201":{"id":201,"parentId":190,"name":"Standard Group New 2","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[392]},"193":{"id":193,"parentId":171,"name":"New group 6","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"194":{"id":194,"parentId":171,"name":"New Group 7","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"195":{"id":195,"parentId":171,"name":"New Gruop 8","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"196":{"id":196,"parentId":171,"name":"New Group 9","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]},"197":{"id":197,"parentId":171,"name":"New Group 10","description":"","displayToUser":0,"displayName":"","displayIcon":"","groupPoints":0,"isTopLevel":false,"code":1,"codeType":"group","groupData":null,"entrances":[326]}},"type":[]};
const select2Data = {"group":{"1":{"id":"1","text":"Standard Group","description":"Used to create a collection of nodes that include all nodes except for User Input nodes (ex: question\/answer nodes)","icon":"\/app\/img\/icons\/group_standard.png","css":"group","allowDisplayToUser":true,"allowPrimary":false,"allowTopLevel":1},"2":{"id":"2","text":"User Input","description":"Used to request input from a user in the form of questions and answers that you define. You can also include filter and action nodes","icon":"\/app\/img\/icons\/group_userInput.png","css":"getUserInput","allowDisplayToUser":false,"allowPrimary":false,"allowTopLevel":1},"3":{"id":"3","text":"Transfer\/Repeat","description":"Used to transfer a user to another node group - whether for the first time, or to repeat the group. You can also selectively define criteria that must be met before the transfer takes place.","icon":"\/app\/img\/icons\/group_transfer.png","css":"transferGroup","allowDisplayToUser":false,"allowPrimary":false,"allowTopLevel":0}},"type":{"1":{"id":"1","text":"Question","description":"Prompt the user with a question.","icon":"\/app\/img\/icons\/type_question.png","css":"userQuestion","allowDisplayToUser":false,"allowPrimary":false,"allowTopLevel":1},"2":{"id":"2","text":"Answer","description":"Provide the user with a possible answer to a question.","icon":"\/app\/img\/icons\/type_answer.png","css":"userInput","allowDisplayToUser":true,"allowPrimary":true,"allowTopLevel":0},"3":{"id":"3","text":"Filter by Property","description":"Filter the path by a property assigned to them as a user, or a property of their site","icon":"\/app\/img\/icons\/type_filterProperty.png","css":"filterProperty","allowDisplayToUser":false,"allowPrimary":false,"allowTopLevel":1},"4":{"id":"4","text":"True","description":"Reached when the test of a Filter by Property node returns true.","icon":"\/app\/img\/icons\/type_true.png","css":"filterTrue","allowDisplayToUser":true,"allowPrimary":true,"allowTopLevel":0},"5":{"id":"5","text":"False","description":"Reached when the test of a Filter by Property node returns false.","icon":"\/app\/img\/icons\/type_false.png","css":"filterFalse","allowDisplayToUser":true,"allowPrimary":true,"allowTopLevel":0},"6":{"id":"6","text":"Filter by Progress","description":"Filter by checking various aspects of other node groups or individual nodes","icon":"\/app\/img\/icons\/type_filterProgress.png","css":"filterTypes","allowDisplayToUser":false,"allowPrimary":false,"allowTopLevel":1},"7":{"id":"7","text":"True","description":"Reached when the test of a Filter by Progress node returns true.","icon":"\/app\/img\/icons\/type_true.png","css":"filterTrue","allowDisplayToUser":true,"allowPrimary":true,"allowTopLevel":0},"8":{"id":"8","text":"False","description":"Reached when the test of a Filter by Progress node returns false.","icon":"\/app\/img\/icons\/type_false.png","css":"filterFalse","allowDisplayToUser":true,"allowPrimary":true,"allowTopLevel":0},"9":{"id":"9","text":"Placeholder","description":"To begin, edit this node before adding child site nodes","icon":"\/app\/img\/icons\/type_question.png","css":"initType","allowDisplayToUser":false,"allowPrimary":false,"allowTopLevel":0}}};

export function getTreeData(dispatch) {
  return (treeType) => {
    let tree, collectionTree, appTree, groupTree, typeTree;
    switch (treeType) {
      case 'collection':
        collectionTree = buildTreeData(collectionData.group, 'group');
        appTree = buildTreeData(appData.group, 'group');
        groupTree = buildTreeData(groupData.group, 'group');
        typeTree = buildTreeData(typeData.group, 'group');
        dispatch({
          type: treeActions.GET_GROUPS_REQUEST,
          payload: {
            treeData: {
              collection: collectionData.group,
              app: appData.group,
              group: groupData.group,
              type: typeData.group
            },
            tree: {
              collection: collectionTree,
              app: appTree,
              group: groupTree,
              type: typeTree
            },
            codeData: select2Data.group
          }
        });
        break;
      case 'app':
        tree = buildTreeData(appData.group, 'group');
        dispatch({
          type: treeActions.GET_GROUPS_REQUEST,
          payload: {
            treeData: {
              app: appData.group
            },
            tree: {app: tree},
            codeData: select2Data.group
          }
        });
        break;
      case 'group':
        /** Normally this would be an ajax call of sorts to get the data if it does not already exist
         *  Instead we're faking it for now...
         ***/
        tree = buildTreeData(groupData.group, 'group');
        dispatch({
          type: treeActions.GET_GROUPS_REQUEST,
          payload: {
            treeData: {group: groupData.group},
            tree: {group: tree},
            codeData: select2Data.group
          }
        });
        break;
      case 'type':
        tree = buildTreeData(typeData.group, 'group');
        dispatch({
          type: treeActions.GET_GROUPS_REQUEST,
          payload: {
            treeData: {type: typeData.group},
            tree: {type: tree},
            codeData: select2Data.group
          }
        });
        break;
    }
  }
}

export function convertToTree(data, options) {
  options = options || {};
  const ID_KEY = options.idKey || 'id';
  const PARENT_KEY = options.parentKey || 'parentId';
  const CHILDREN_KEY = options.childrenKey || 'childNodes';
  const TOPLEVEL_ID = options.topLevelId || null;
  let tree = [],
    childrenOf = {};
  let item, id, parentId;

  for (var i = 0, length = data.length; i < length; i++) {
    item = data[i];
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    // every item may have children
    childrenOf[id] = childrenOf[id] || [];
    // init its children
    item[CHILDREN_KEY] = childrenOf[id];
    if (parentId == 0) {
      tree.push(item);
    } else {
      // init its parent's children object
      childrenOf[parentId] = childrenOf[parentId] || [];
      // push it into its parent's children object
      childrenOf[parentId].push(item);
    }
  };
  if (TOPLEVEL_ID) {
    return filterDataTreeForId(TOPLEVEL_ID, tree);
  }
  return tree;
}

export function buildTreeData(rawData, treeType) {
  let filtered = [];
  switch(treeType) {
    case 'group':
      for (var gId in rawData) {
        if (rawData.hasOwnProperty(gId)) {
          filtered.push(rawData[gId]);
        }
      }
      return filtered.length > 0 ? convertToTree(filtered) : null;

      break;
    case 'type':
      //this.tree = null;
      break;
  }
}

export function filterDataTreeForId (id, tree) {
  for (var i in tree) {
    if (tree.hasOwnProperty(i)) {
      if (tree[i].id == id) {
        return tree[i];
      } else {
        return filterDataTreeForId(id, tree[i].childNodes);
      }
    }
  }
  return null;
}



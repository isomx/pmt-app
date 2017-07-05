/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MdTransitionBodyElement from '../../components/RootBodyElement';
import { transitionTypes } from '../../actions/transitionTypes';
import Rx from 'rxjs/Rx';
import uniqueId from 'lodash/uniqueId';
import pull from 'lodash/pull';
import forOwn from 'lodash/forOwn';
import takeWhile from 'lodash/takeWhile';
import reverse from 'lodash/reverse';

import { actionTypes } from '../../actions/actionTypes';
import { registerApiHandler } from '../../actions/held/apiActions';

// import difference from 'lodash/difference';
// import { createChildStream, createInternalKey, source$ } from '../observables/transitions';
// import uniqueId from 'lodash/uniqueId';

class MdTransitionConnect extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.id = uniqueId();
    let initStore = {};
    initStore[this.id] = {
      id: this.id,
      parentId: 0,
      name: 'mdTransitionConnect',
      type: 'connect',
      childIds: [],
      path: '',
    };
    this.store$ = new Rx.BehaviorSubject(initStore);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    registerApiHandler(this.handleApiRequest);
    this.recordedPosition = [];
    this.updateInProgress = false;
    this.state = {
      bodyElements: {},
    }
  }

  getNonce() {
    let text = [];
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return text.join('');
  }

  getScrollData() {
    // const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return {
      scrollTop: window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop  || 0,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      clientTop: document.documentElement.clientTop  || document.body.clientTop  || 0,
      clientLeft: document.documentElement.clientLeft || document.body.clientLeft || 0,
    }
  }

  getElemPosition(domRef) {
    const rect = domRef.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      height: rect.height,
      width: rect.width,
    }
  }

  /**
  buildStoreTree(data) {
    let tree = [], childrenOf = {}, item, id, parentId;
    for (let i = 0, length = data.length; i < length; i++) {
      item = data[i];
      id = item.id;
      parentId = item.parentId || 0;
      // every item may have children
      childrenOf[id] = childrenOf[id] || [];
      // init its children
      item.children = childrenOf[id];
      if (parentId == 0) {
        tree.push(item);
      } else {
        // init its parent's children object
        childrenOf[parentId] = childrenOf[parentId] || [];
        // push it into its parent's children object
        childrenOf[parentId].push(item);
      }
    };
    console.log('tree = ', tree);
    return tree;
  }

  prepareForTransition() {
    const elems = this.store$.getValue();
    let data = [];
    for(let id in elems) {
      if (elems.hasOwnProperty(id)) {
        data.push(elems[id]);
      }
    }
    if (data.length > 0) {
      console.log('prepareForTransition data = ', data);
      const tree = this.buildStoreTree(data);
      console.log('tree = ', tree);
    }
  }
   **/

  removeElemsAndChildren(store, ids, mutate = false, firstRun = true) {
    if (!mutate) {
      store = {...store};
    }
    for (let i in ids) {
      if (firstRun && !mutate) {
        const pElem = store[store[ids[i]].parentId];
        if (pElem) {
          store[pElem.id] = {...pElem, childIds: [].concat(pElem.childIds)};
        }
      }
      store = this.removeElemAndChildren(store, ids[i], true, firstRun);
      firstRun = false;
    }
    return store;
  }

  removeElemAndChildren(store, id, mutate = false, firstRun = true) {
    if (!mutate) {
      store = {...store};
    }
    let childIds = store[id].childIds;
    if (childIds.length > 0) {
      for (let i in childIds) {
        this.removeElemAndChildren(store, childIds[i], true, false);
      }
    }
    if (firstRun) {
      //only remove from childIds array of parent if first run, all the rest will be deleted when the key is deleted
      const pElem = store[store[id].parentId];
      if (pElem) {
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

  convertElemPathToNames(elems, pathString, returnArray = true) {
    const path = pathString.split('||');
    path.splice(path.length - 1, 1); //always going to have an empty ending, since path ends in ||
    let names = [];
    for (let i in path) {
      if (elems[path[i]]) {
        names.push(elems[path[i]].name);
      }
    }
    return returnArray ? names : names.join('||') + '||';
  }

  getElemTypesInPath(storeElems, pathString, idsOnly = false, reverse = false) {
    const path = pathString.split('||');
    path.splice(path.length - 1, 1); //always going to have an empty ending, since path ends in ||
    let found = {};
    for (let i in path) {
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

  handleApiRequest(action) {
    switch(action.type) {
      case actionTypes.API.DISPATCH_TO_PARENT_GROUP:

        break;
    }
  }

  receiveDispatch(action) {
    let elems = {};
    switch(action.type) {
      case actionTypes.BODY_ELEMENT_CONNECT:
        elems = this.store$.getValue();
        elems[action.payload.id].receiveDispatch = action.payload.receiveDispatch;
        this.store$.next(elems);
        break;
      case actionTypes.CONNECT_COMPONENT:
        const { type, parentId, receiveDispatch, name } = action.payload;
        elems = this.store$.getValue();
        const id = uniqueId();
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
        this.store$.next(elems);
        return id;
      case actionTypes.DISCONNECT_COMPONENT:
        elems = this.store$.getValue();
        if (elems[action.payload.id]) {
          const pId = elems[action.payload.id].parentId;
          if (elems[pId]) { //In case parent already unmounted
            const childIndex = elems[pId].childIds.indexOf(action.payload.id);
            if (childIndex) elems[pId].childIds.splice(childIndex, 1);
          }
          delete elems[action.payload.id];
          this.store$.next(elems);
        }
        break;
      case actionTypes.GROUP_WILL_UPDATE:
        console.log('GROUP_WILL_UPDATE = ', action.payload);
        if (!this.updateInProgress) {
          this.updateInProgress = true;
          let toTransition = {};
          let groupTransTypes = {
            anchorAndCommon: [],
            anchorOnly: [],
            commonOnly: [],
          };
          let idsToLeave = [];
          const scrollData = this.getScrollData();
          const updater = Rx.Observable.create((observer) => {
            this.updateObserver = observer;
          })
            .takeWhile((act) => act.type === actionTypes.GROUP_DID_UPDATE && act.payload.id === action.payload.id ? false : true)
            .filter((act) => act.type === actionTypes.GROUP_WILL_UPDATE)
          updater.subscribe(
              (acc) => {
                toTransition[acc.payload.id] = {
                  id: acc.payload.id,
                  transitionType: acc.payload.transitionType,
                  handleUpdate: acc.payload.handleUpdate,
                }
                idsToLeave.push(...acc.payload.idsToLeave);
                switch(acc.payload.transitionType) {
                  case transitionTypes.ANCHOR_COMMON_ELEMENT:
                    groupTransTypes.anchorAndCommon.push(acc.payload.id);
                    groupTransTypes.anchorOnly.push(acc.payload.id);
                    groupTransTypes.commonOnly.push(acc.payload.id);
                    break;
                  case transitionTypes.ANCHOR_ONLY:
                    groupTransTypes.anchorOnly.push(acc.payload.id);
                    break;
                  case transitionTypes.COMMON_ELEMENT_ONLY:
                    groupTransTypes.commonOnly.push(acc.payload.id);
                  default:
                }
              },
              (err) => {},
              () => {
                let elems = this.store$.getValue();
                console.log('elems = ', elems);
                let activeElems = this.removeElemsAndChildren(elems, idsToLeave);
                console.log('activeElems = ', activeElems);
                const anchorOnlyLength = groupTransTypes.anchorOnly.length;
                const commonOnlyLength = groupTransTypes.commonOnly.length;

                if (anchorOnlyLength > 0 || commonOnlyLength > 0) {
                  let candidates;
                  const recPos = {...this.recordedPosition};
                  candidates = this.findTransitionElems(elems, activeElems, recPos);
                  let {best, bestAnchor, bestCommonElement} = candidates;
                  if (best) {
                    // if best does not exist, nothing was found
                    if (best.type === 'anchor') {
                      if (anchorOnlyLength > 0) {
                        //somebody wants an anchor - groups that want a commonElementAndAnchor will also be
                        // in the anchorOnly array, since that would be the fallback
                        toTransition = this.prepareTransitionData(toTransition, best, elems, activeElems);
                      } else if (commonOnlyLength > 0 && bestCommonElement) {
                        // use the commonElement
                        toTransition = this.prepareTransitionData(toTransition, bestCommonElement, elems, activeElems);
                      } else {
                        // no matching values

                      }
                    } else if (best.type === 'commonElement') {
                      if (commonOnlyLength > 0) {
                        toTransition = this.prepareTransitionData(toTransition, best, elems, activeElems);
                      } else if (anchorOnlyLength > 0 && bestAnchor) {
                        // use the anchor
                        toTransition = this.prepareTransitionData(toTransition, bestAnchor, elems, activeElems);
                      } else {
                        //no matching values found
                      }
                    }
                  }
                }
                let groupUpdate$ = [], groupUpdateResp;
                forOwn(toTransition, (data, key, obj) => {
                  if (key !== 'bestGroupAndChild') {
                    groupUpdateResp = data.handleUpdate(data.transitionData, scrollData);
                    if (groupUpdateResp) groupUpdate$.push(groupUpdateResp);
                  }
                });
                const doTransition$ = Rx.Observable.merge(...groupUpdate$)
                  .do(() => {
                    this.updateInProgress = false;
                    this.recordedPosition = {};
                  })
                setTimeout(() => {
                  doTransition$.subscribe(
                    (val) => {
                      console.log('merged transition obs val = ', val)
                    },
                    (err) => {
                    },
                    () => {
                      console.log('transition obs complete')
                    }
                  );
                }, 500000);
            });
        }
        this.updateObserver.next(action);
        break;
      case actionTypes.GROUP_DID_UPDATE:
        this.updateObserver.next(action);
        break;
      case actionTypes.EVENT_RECORD_POSITION:
        elems = this.store$.getValue();
        /**
         * IMPORTANT! Key off of top->down path, vs. down->up, because then you can make sure
         * you associate a commonElement with its most direct parent anchor, since the anchor
         * that comes last (that has the commonElement as a child) will win
         **/
        let path = elems[action.payload.id].path.split('||');
        path.splice(path.length - 1, 1); //always going to have an empty ending, since path ends in ||
        this.recordedPosition = {
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
        for (let i in path) {
          val = elems[path[i]];
          this.recordedPosition.names.push(val.name);
          this.recordedPosition.types.push(val.type);
          if (val.type === 'anchor') {
            this.recordedPosition.anchors.names.push(val.name);
            this.recordedPosition.anchors.ids.push(val.id);
            if (val.childIds.length > 0) {
              for (let ii in val.childIds) {
                childVal = elems[val.childIds[ii]];
                if (childVal.type === 'commonElement') {
                  // ok to override existing commonElement, since this current anchor is more
                  // direct to the commonElement than any preceding anchors since you're using
                  // a top->down path
                  this.recordedPosition.commonElements.names.push(childVal.name);
                  this.recordedPosition.commonElements.ids.push(childVal.id);
                }
              }
            }
          } else if (val.type === 'commonElement') {
            // Don't override a common element already added by an anchor
            this.recordedPosition.commonElements.names.push(val.name);
            this.recordedPosition.commonElements.ids.push(val.ids);
          }
        }
        break;
    }

  }

  prepareTransitionData(toTransition, transElem, allElems, activeElems) {
    let bestPath, bestGroupVal = -2, bestGroupChildVal = -2, bestGroupId, bestGroupChildId, gIndex, gcIndex;
    bestPath = transElem.path.split('||');
    bestPath.splice(bestPath.length - 1, 1); //always going to have an empty ending, since path ends in ||
    forOwn(toTransition, (val, gId) => {
      console.log('val.transitionType = ', val.transitionType);
      console.log('transitionType test = ', val.transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT);
      if (val.transitionType === transitionTypes.ANCHOR_ONLY || val.transitionType === transitionTypes.COMMON_ELEMENT_ONLY || val.transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT) {
        gIndex = bestPath.indexOf(gId);
        console.log('gIndex = ', gIndex);
        if (gIndex > bestGroupVal) {
          if (bestGroupId) {
            //one already assigned, remove it.
            delete toTransition[bestGroupId].transitionData;
          }
          bestGroupId = gId;
          console.log('bestGroupId = ', gId);
          let gChildIds = activeElems[gId].childIds;
          /**
           * Originally I thought you should check that childIds.length > 0, in case a group renders 0 children
           * only to animate out the existing groupChildren. But in that case, there'd be no way a commonElement
           * or anchor would be a match for the group, since nothing would be "seen" during the process of
           * finding the best matching commonElement/anchor
           */
          bestGroupChildVal = -2; //ensure at least 1 matches
          for (let i in gChildIds) {
            gcIndex = bestPath.indexOf(gChildIds[i]);
            console.log('gcIndex = ', gcIndex);
            if (gcIndex > bestGroupChildVal) {
              bestGroupChildId = gChildIds[i];
            }
          }
          if (toTransition[gId].transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT && bestCommonElementAndAnchor.anchor && bestCommonElementAndAnchor.commonElement) {
            /**
             * NOTE: I'm not checking if the bestCommonElement anchor/commonElement matches this.
             * That's because this group won. If it wants a commonElementAndAnchor, and one exists,
             * it gets to use it. This ensures the overall best combination gets picked -
             * between what is available & what each group wants
             */
            toTransition[gId].transitionData = {
              toAnchor: {
                elem: bestCommonElementAndAnchor.anchor,
                data: {}
              },
              toCommonElement: {
                elem: bestCommonElementAndAnchor.commonElement,
                data: {},
              },
              childId: bestGroupChildId,
            }
          } else {
            let t;
            switch (transElem.type) {
              case 'commonElement':
                t = 'toCommonElement';
                break;
              case 'anchor':
                t = 'toAnchor';
                break;
              default:
                t = null;
            }
            if (t) {
              toTransition[gId].transitionData = {
                [t]: {
                  elem: transElem,
                  data: {},
                },
                childId: bestGroupChildId,
              }
            }
          }
        }
      }
    });
    if (bestGroupId) {
      // successfully assigned transition to group/child. Compile dimensions
      let toId, fromId, toResp, fromResp;
      if (toTransition[bestGroupId].toAnchor.elem) {
        toId = toTransition[bestGroupId].toAnchor.elem.id;
        fromId = toTransition[bestGroupId].toAnchor.elem.matchId;
        toResp = activeElems[toId].receiveDispatch({type: actionTypes.ANCHOR_GET_ELEM});
        fromResp = allElems[fromId].receiveDispatch({type: actionTypes.ANCHOR_GET_ELEM});
        if (toResp && fromResp) {
          toTransition[bestGroupId].transitionData.toAnchor.data = {
            rect: this.getElemPosition(toResp.ref),
            children: toResp.children,
          }
          toTransition[bestGroupId].transitionData.fromAnchor = {
            elem: allElems[fromId],
            data: {
              rect: this.getElemPosition(fromResp.ref),
              children: fromResp.children,
            }
          }
        } else {
          // necessary responses not received, cannot use it.
          delete toTransition[bestGroupId].transitionData.toAnchor;
        }
      }
      if (toTransition[bestGroupId].toCommonElement.elem) {
        toId = toTransition[bestGroupId].toCommonElement.elem.id;
        fromId = toTransition[bestGroupId].toAnchor.elem.matchId;
        toResp = activeElems[toId].receiveDispatch({type: actionTypes.COMMON_ELEMENT_GET_ELEM});
        fromResp = allElems[fromId].receiveDispatch({type: actionTypes.COMMON_ELEMENT_GET_ELEM});
        if (toResp && fromResp) {
          toTransition[bestGroupId].transitionData.toCommonElement.data = {
            rect: this.getElemPosition(toResp.ref),
            children: toResp.children,
          }
          toTransition[bestGroupId].transitionData.fromCommonElement = {
            elem: allElems[fromId],
            data: {
              rect: this.getElemPosition(fromResp.ref),
              children: fromResp.children,
            }
          }
        } else {
          // necessary responses not received, cannot use it.
          delete toTransition[bestGroupId].transitionData.toCommonElement;
        }
      }
    }
    toTransition['bestGroupAndChild'] = {
      groupId: bestGroupId,
      groupChildId: bestGroupChildId,
    };
    console.log('toTransition after assigning to group = ', toTransition);
    return toTransition;
  }


  findTransitionElems(allElems, activeElems, recPos) {
    console.log('recPos = ', recPos);
    let commonCandidates = {
      best: {},
      bestGroup: {},
      bestGroupChild: {},
      bestAnchor: {},
      bestCommonElement: {},
      bestCommonElementAndAnchor: {},
    };
    let candidateValues = {
      best: 0,
      bestGroup: 0,
      bestGroupChild: 0,
      bestAnchor: 0,
      bestCommonElement: 0,
      bestCommonElementAndAnchor: 0,
    }
    let secondPass = {}; // in case a child somehow comes before a parent
    let indexVal, matchId, commonElemsWithAnchorCheck, commonElemsWithAnchorMatchVal;
    const recPathLength = recPos.path.length;
    forOwn(activeElems, (value, key, obj) => {
      if (value.parentId == 0) {
        value.matchCount = 1;
        value.matchVal = (recPos.names.indexOf(value.name) + 1) * (value.matchCount / recPathLength);
      } else if (obj[value.parentId].matchVal) {
        indexVal = recPos.names.indexOf(value.name);
        matchId = null; //to prevent overriding below extra section for detecting commonElements that aren't in the path already
        if (indexVal < 0 && value.type === 'commonElement') {
          indexVal = recPos.commonElements.names.indexOf(value.name);
          // console.log('indexVal of commonElements = ', indexVal);
          if (indexVal > -1) {
            // this is the same as lastIndex + 1, since it is not in the array, but is the child of an
            // anchor that was part of the recordedPath. RecordedPath does not include common elements,
            // unless the event is wrapped by one.
            matchId = recPos.commonElements.ids[indexVal];
            indexVal = recPathLength;
          }
        }
        if (indexVal > -1) {
          if (!matchId) matchId = recPos.path[indexVal]; //could have been selected in above commonElement section
          value.matchId = matchId;
          value.matchCount = obj[value.parentId].matchCount + 1;
          value.matchVal = (((indexVal + 1) * 2) * (value.matchCount / recPathLength)) + obj[value.parentId].matchVal;
          switch (value.type) {
            case 'group':
              //NOT USED!!!
              if (value.matchVal > candidateValues.bestGroup) {
                candidateValues.bestGroup = value.matchVal;
                commonCandidates.bestGroup = value;
              }
              break;
            case 'groupChild':
              //NOT USED!!
              if (value.matchVal > candidateValues.bestGroupChild) {
                candidateValues.bestGroupChild = value.matchVal;
                commonCandidates.bestGroupChild = value;
              }
            case 'anchor':
              if (value.matchVal > candidateValues.best) {
                candidateValues.best = value.matchVal;
                commonCandidates.best = value;
              }
              if (value.matchVal > candidateValues.bestAnchor) {
                candidateValues.bestAnchor = value.matchVal;
                commonCandidates.bestAnchor = value;
              }
              break;
            case 'commonElement':
              if (value.matchVal > candidateValues.best) {
                candidateValues.best = value.matchVal;
                commonCandidates.best = value;
              }
              if (value.matchVal > candidateValues.bestCommonElement) {
                candidateValues.bestCommonElement = value.matchVal;
                commonCandidates.bestCommonElement = value;
              }
              if (value.matchVal > candidateValues.bestCommonElementAndAnchor) {
                // shortcut -- no need to search for an anchor unless this elem has the potential to beat
                // the best commonElementWithAnchor elem
                commonElemsWithAnchorCheck = this.getElemTypesInPath(activeElems, value.path).anchor;
                if (commonElemsWithAnchorCheck.length > 0) {
                  // yep, has anchor. Find best one (if multiple)
                  if (commonElemsWithAnchorCheck.length > 1) {
                    //more than 1, find best
                    commonElemsWithAnchorMatchVal = 0;
                    for (let i in commonElemsWithAnchorCheck) {
                      if (commonElemsWithAnchorCheck[i].matchVal > commonElemsWithAnchorMatchVal) {
                        commonCandidates.bestCommonElementAndAnchor = {
                          anchor: commonElemsWithAnchorCheck[i],
                          commonElement: value,
                        };
                        commonElemsWithAnchorMatchVal = commonElemsWithAnchorCheck[i].matchVal;
                      }
                    }
                  } else {
                    candidateValues.bestCommonElementAndAnchor = value.matchVal;
                    commonCandidates.bestCommonElementAndAnchor = {
                      anchor: commonElemsWithAnchorCheck[0],
                      commonElement: value,
                    };
                  }
                }
              }
              break;
            default:
          }
        } else {
          value.matchCount = obj[value.parentId].matchCount;
          value.matchVal = obj[value.parentId].matchVal;
        }
      } else {
        /** NOTE - I don't see how this would ever happen. But I'm keeping it here
         * for now until it's 100% sure. But you always know the ids are going to be in order, there
         * should never be a scenario where a childId in the elems array appears before its parent.
         * Thus, no need to track for a second pass.
         */
        secondPass[key] = value;
      }
    });
    console.log('commonCandidates = ', commonCandidates);
    console.log('candidateValues = ', candidateValues);
    return commonCandidates;
  }

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
      mdTransitionDispatch: this.receiveDispatch,
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {

  }

  manageBodyElements(action) {
    switch(action.type) {
      case 'update':
      case 'add':
      case 'remove':
    }
  }

  addBodyElements(elems, callback, store) {
    console.log('addBodyElements = ', elems);
    if (!store) store = this.store$.getValue();
    let elemData = {}, newElems = {};
    for (let i in elems) {
      elemData = elems[i];
      const id = uniqueId();
      store[id] = {
        id,
        parentId: this.id,
        name: 'bodyElement__' + id,
        type: 'bodyElement',
        childIds: [],
        path: store[this.id].path + this.id + '||',
      };
      store[this.id].childIds.push(id);
      this.store$.next(store);
      elemData.id = id;
      elemData.key = id;
      newElems[id] = elemData;
    }
    this.setState((prevState, props) => {
      let newState = {...prevState};
      newState.bodyElements = {...prevState.bodyElements, ...newElems};
      newState.nonce = this.getNonce();
      return newState;
    }, callback);
  }

  removeBodyElements(ids, callback) {
    this.setState((prevState, props) => {
      let newState = {...prevState};
      for(let i in ids) {
        delete newState[ids[i]];
      }
      newState.nonce = this.getNonce();
      return newState;
    }, callback);
  }

  render() {
    console.log('mdTransitionConnect Rendering = ', this.state.bodyElements);
    const currNonce = this.nonce;
    let updateMain = true;
    let render = [];
    if (this.state.bodyElements) {
      forOwn(this.state.bodyElements, (elemData, key, obj) => {
        console.log('render elemData = ', elemData);
        render.push(<RootBodyElement {...elemData} />);
      });
    }
    render.push(
      <RootBodyElement key="root" isRoot update={this.state.nonce !== this.nonce ? false : true} {...this.props}>
        {this.props.children}
      </RootBodyElement>
    );
    this.nonce = this.state.nonce;
    return (<div>{render}</div>);
    /**
    let render = React.Children.map(this.state.children, (child) => {
      count++;
      return(
        <RootBodyElement key={child.key}>
          {child}
        </RootBodyElement>
      );
    });
     **/
    // return React.Children.only(this.props.children);
  }

}

MdTransitionConnect.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}

function mapStateToProps(store, ownProps) {
  return {
    location: store.router.location,

  };
}

function mapDispatchToProps(dispatch, state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MdTransitionConnect);
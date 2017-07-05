/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MdTransitionBodyElement from '../components/RootBodyElement';
import { transitionTypes } from '../actions/transitionTypes';
import Rx from 'rxjs/Rx';
import uniqueId from 'lodash/uniqueId';
import pull from 'lodash/pull';
import forOwn from 'lodash/forOwn';
import takeWhile from 'lodash/takeWhile';
import reverse from 'lodash/reverse';

import { actionTypes } from '../actions/actionTypes';
import { registerApiHandler } from '../actions/apiActions';

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
    this.addBodyElements = this.addBodyElements.bind(this);
    this.removeBodyElements = this.removeBodyElements.bind(this);
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
    let t = window, objVar = 'inner';
    if (!('innerWidth' in window)) {
      objVar = 'client';
      t = document.documentElement || document.body;
    }
    return {
      scrollTop: window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop  || 0,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      clientTop: document.documentElement.clientTop  || document.body.clientTop  || 0,
      clientLeft: document.documentElement.clientLeft || document.body.clientLeft || 0,
      viewPortWidth: t[objVar + 'Width'],
      viewPortHeight: t[objVar + 'Height'],
    }

    /**
    return {
      scrollTop: window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop  || 0,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      clientTop: document.documentElement.clientTop  || document.body.clientTop  || 0,
      clientLeft: document.documentElement.clientLeft || document.body.clientLeft || 0,
      viewPortWidth: e[a + 'Width'],
      viewPortHeight: e[a + 'Height'],
    }
     **/
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
          };
          let groupUpdate$ = [];
          let idsToLeave = [];
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
                groupUpdate$.push(acc.payload.handleUpdate);
                switch(acc.payload.transitionType) {
                  case transitionTypes.ANCHOR_COMMON_ELEMENT:
                    groupTransTypes.anchorAndCommon.push(acc.payload.id);
                    groupTransTypes.anchorOnly.push(acc.payload.id);
                    break;
                  case transitionTypes.ANCHOR_ONLY:
                    groupTransTypes.anchorOnly.push(acc.payload.id);
                    break;
                  default:
                }
              },
              (err) => {},
              () => {
                let elems = this.store$.getValue();
                let activeElems = this.removeElemsAndChildren(elems, idsToLeave);
                const doGroupUpdate$ = Rx.Observable.merge(...groupUpdate$)
                  .do(() => {
                    this.updateInProgress = false;
                    this.recordedPosition = {};
                  });
                const transition$ = this.prepareTransitionData(toTransition, elems, activeElems, groupTransTypes);
                if (transition$) {
                  transition$.subscribe(
                    (v) => {console.log('transition$ next v = ', v)},
                    (err) => {console.log('transition$ err = ', err)},
                    () => {
                      console.log('transition$ complete ')
                      doGroupUpdate$.subscribe(
                        (v) => {console.log('doGroupUpdate$ next = ', v)},
                        (err) => {console.log('doGroupUpdate$ err = ', err)},
                        () => {console.log('doGroupUpdate$ complete')}
                      );
                    }
                  );
                } else {
                  doGroupUpdate$.subscribe(
                    (v) => {console.log('doGroupUpdate$ NO MOTION next = ', v)},
                    (err) => {console.log('doGroupUpdate$ NO MOTION err = ', err)},
                    () => {console.log('doGroupUpdate$ NO MOTION complete')}
                  );
                }
                /**
                let groupUpdate$ = [], groupUpdateResp;
                forOwn(toTransition, (data, key, obj) => {
                  groupUpdateResp = data.handleUpdate(data.transitionData);
                  if (groupUpdateResp) groupUpdate$.push(groupUpdateResp);
                });
                 **/
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

  prepareTransitionData(toTransition, allElems, activeElems, groupTransTypes) {
    let bestPath, bestGroupVal = -2, bestGroupChildVal = -2, bestGroupId, bestGroupChildId, gIndex, gcIndex;
    let bestAnchor, bestCommon;
    if (groupTransTypes.anchorOnly.length > 0) {
      const recPos = {...this.recordedPosition};
      const transElemResp = this.findTransitionElems(allElems, activeElems, recPos, groupTransTypes.anchorAndCommon.length > 0);
      if (transElemResp.bestAnchor) {
        bestAnchor = transElemResp.bestAnchor;
        if (transElemResp.bestCommon) {
          bestCommon = transElemResp.bestCommon;
        }
      }
    }
    forOwn(toTransition, (val, gId) => {
      if (bestAnchor) {
        bestPath = bestAnchor.path.split('||');
        bestPath.splice(bestPath.length - 1, 1); //always going to have an empty ending, since path ends in ||
        gIndex = bestPath.indexOf(gId);
        if (gIndex > bestGroupVal) {
          if (bestGroupId) {
            //one already assigned, remove it.
            delete toTransition[bestGroupId].transitionData;
          }
          bestGroupId = gId;
          let gChildIds = activeElems[gId].childIds;
          /**
           * Originally I thought you should check that childIds.length > 0, in case a group renders 0 children
           * only to animate out the existing groupChildren. But in that case, there'd be no way a commonElement
           * or anchor would be a match for the group, since nothing would be "seen" during the process of
           * finding the best matching commonElement/anchor (because activeElems only includes what will remain on page)
           */
          bestGroupChildVal = -2; //ensure at least 1 matches
          for (let i in gChildIds) {
            gcIndex = bestPath.indexOf(gChildIds[i]);
            if (gcIndex > bestGroupChildVal) {
              bestGroupChildId = gChildIds[i];
            }
          }
          if (toTransition[gId].transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT && bestCommon.id) {
            toTransition[gId].transitionData = {
              toAnchor: {
                elem: bestAnchor,
              },
              toCommonElement: {
                elem: bestCommon,
              },
              childId: bestGroupChildId,
            }
          } else {
            toTransition[gId].transitionData = {
              toAnchor: {
                elem: bestAnchor,
              },
              childId: bestGroupChildId,
            }
          }
        }
      }
    });
    let doTransition$;
    if (bestGroupId) {
      // successfully assigned transition to group/child. Compile dimensions
      if (toTransition[bestGroupId].transitionData) {
        if (toTransition[bestGroupId].transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT || toTransition[bestGroupId].transitionType === transitionTypes.ANCHOR_ONLY) {
          // toTransition[bestGroupId].transitionData = this.prepareMotionTransition(toTransition[bestGroupId].transitionData, allElems, activeElems);
          const motionRender$ = this.prepareMotionTransition(toTransition[bestGroupId].transitionData, allElems, activeElems);
          if (motionRender$) {
            doTransition$ = motionRender$;
          }
        }
      }
    }
    return doTransition$;
  }

  prepareMotionTransition(transData, allElems, activeElems) {
    let toId, fromId, toResp, fromResp, doMotion$;
    let scrollData = this.getScrollData();
    console.log('scrollData = ', scrollData);
    if (transData.toAnchor) {
      //yes, could put in same "if" statement, but there will be more types of transitions than just anchors
      toId = transData.toAnchor.elem.id;
      fromId = transData.toAnchor.elem.matchId;
      /**
       * For the toAnchor, go ahead and get the rect so the receiving transition groupChild can scroll to it before
       * initiating the observables. This will greatly reduce the math necessary, since then all the rect returned
       * through the observables will be accurate to the scroll position of the entering anchor.
       */
      toResp = activeElems[toId].receiveDispatch({type: actionTypes.ANCHOR_PREPARE_TRANS, payload: {to: true, scrollData, addToScroll: -88,}});
      fromResp = allElems[fromId].receiveDispatch({type: actionTypes.ANCHOR_PREPARE_TRANS, payload: {to: false, scrollData,}});
      if (toResp && fromResp) {
        let reverse = false, toAnchor, fromAnchor, toCommon, fromCommon, newBodyElems = [], render$ = [], cleanup$ = [];
        if (toResp.rect.width + toResp.rect.height < fromResp.rect.width + fromResp.rect.height) {
          // fromAnchor = {elem: transData.toAnchor.elem, ...toResp};
          // toAnchor = {elem: allElems[fromId], ...fromResp};
          reverse = true;
        } else {
          toAnchor = {elem: transData.toAnchor.elem, ...toResp};
          fromAnchor = {elem: allElems[fromId], ...fromResp};
        }
        reverse = false;
        toAnchor = {elem: transData.toAnchor.elem, ...toResp};
        fromAnchor = {elem: allElems[fromId], ...fromResp};
        console.log('toAnchor = ', toAnchor);
        console.log('fromAnchor = ', fromAnchor);
        newBodyElems.push({
          renderComponent: (data) => {
            const style = {
              position: 'fixed',
              top: 0,
              left: 0,
              height: `${scrollData.viewPortHeight}px`,
              width: `${scrollData.viewPortWidth}px`,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9,
            };
            return (
              <div key='animationOverlay' style={style} />
            );
          }
        });
        if (transData.toCommonElement) {
          toId = transData.toCommonElement.elem.id;
          fromId = transData.toCommonElement.elem.matchId;
          toResp = activeElems[toId].receiveDispatch({type: actionTypes.COMMON_PREPARE_TRANS, payload: {style: {opacity: 0}}});
          fromResp = allElems[fromId].receiveDispatch({type: actionTypes.COMMON_PREPARE_TRANS, payload: {}});
          if (toResp && fromResp) {
            if (reverse) {
              fromCommon = {elem: transData.toCommonElement.elem, ...toResp};
              toCommon = {elem: allElems[fromId], ...fromResp};
            } else {
              toCommon = {elem: transData.toCommonElement.elem, ...toResp};
              fromCommon = {elem: allElems[fromId], ...fromResp};
            }
            console.log('toCommon = ', toCommon);
            console.log('fromCommon = ', fromCommon);
            newBodyElems.push({
              renderComponent: (data) => {
                const style = {
                  position: 'absolute',
                  top: `${fromCommon.rect.top}px`,
                  left: `${fromCommon.rect.left}px`,
                  height: `${fromCommon.rect.height}px`,
                  width: `${fromCommon.rect.width}px`,
                  zIndex: 10,
                };
                const ref = toCommon.getRef();
                console.log('renderCommonCopy ref = ', ref);
                return (
                  <div key={`commonCopy_${data.id}`} id={`commonCopy_${data.id}`} style={style} dangerouslySetInnerHTML={{__html: toCommon.getRef().cloneNode(true).innerHTML}} />
                );
              },
            });
            render$.push(toCommon.render$);
            cleanup$.push(toCommon.transComplete$);
          } else {
            // necessary responses not received, cannot use it.
            delete transData.toCommonElement;
          }
        }
        // setup anchor
        newBodyElems.push({
          renderComponent: (data) => {
            const containerStyle = {
              position: 'absolute',
              top: `${fromAnchor.rect.top}px`,
              left: `${fromAnchor.rect.left}px`,
              height: `${fromAnchor.rect.height}px`,
              width: `${fromAnchor.rect.width}px`,
              zIndex: 10,
              overflow: 'hidden',
            };
            const style = {
              position: 'absolute',
              top: `${0}px`,
              left: `${0}px`,
              height: `${toAnchor.rect.height}px`,
              width: `${toAnchor.rect.width}px`,
              zIndex: 10,
            };
            return (
              <div key={`anchorCopyContainer_${data.id}`} id={`anchorCopyContainer_${data.id}`} style={containerStyle}>
                <div id={`anchorCopy_${data.id}`} style={style} dangerouslySetInnerHTML={{__html: toAnchor.getRef().cloneNode(true).innerHTML}} />
              </div>
            );
          },
        });
        const newBodyElemResp = this.addBodyElements(newBodyElems, allElems);
        let bodyElemIds;
        if (newBodyElems) {
          bodyElemIds = newBodyElemResp.ids;
          render$.push(newBodyElemResp.add$);
        }
        const removeBodyElems$ = this.removeBodyElements(bodyElemIds);
        cleanup$.push(removeBodyElems$);
        doMotion$ = Rx.Observable.create((observer) => {
          const doRender$ = Rx.Observable.merge(...render$);
          doRender$.subscribe(
            (v) => {console.log('doMotion render$ v = ', v)},
            (err) => {console.log('doMotion render$ err = ', err)},
            () => {
              console.log('doMotion render$ complete');
              setTimeout(() => {
                Rx.Observable.merge(...cleanup$).subscribe(
                  (v) => {console.log('removeBodyElems$ v = ', v)},
                  (err) => {console.log('removeBodyElems$ err = ', err)},
                  () => {
                    console.log('removeBodyElems$ complete')
                    observer.complete();
                  },
                );
              }, 5000);
            }
          );
        });
      } else {
        // necessary responses not received, cannot use it.
        delete transData.toAnchor;
      }
    }
    console.log('transData = ', transData);
    return doMotion$;
  }


  findTransitionElems(allElems, activeElems, recPos, anchorAndCommon = true) {
    let commonCandidates = {
      best: {},
      bestAnchor: {},
      bestCommon: {},
    };
    let candidateValues = {
      best: 0,
      bestAnchor: 0,
      bestCommon: 0,
    }
    let secondPass = {}; // in case a child somehow comes before a parent
    let indexVal, matchId, anchorCheck, commonElemsWithAnchorMatchVal;
    const recPathLength = recPos.path.length;
    forOwn(activeElems, (value, key, obj) => {
      if (value.parentId == 0) {
        value.matchCount = 1;
        value.matchVal = (recPos.names.indexOf(value.name) + 1) * (value.matchCount / recPathLength);
      } else if (obj[value.parentId].matchVal) {
        indexVal = recPos.names.indexOf(value.name);
        matchId = null; //to prevent overriding below extra section for detecting commonElements that aren't in the path already
        if (indexVal < 0 && value.type === 'commonElement' && anchorAndCommon) {
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
            case 'anchor':
              if (value.matchVal > candidateValues.bestAnchor) {
                candidateValues.bestAnchor = value.matchVal;
                commonCandidates.bestAnchor = value;
                if (commonCandidates.bestCommon) {
                  commonCandidates.bestCommon = {};
                  candidateValues.bestCommon = 0;
                }
              }
              break;
            case 'commonElement':
              if (anchorAndCommon && commonCandidates.bestAnchor && value.matchVal > candidateValues.bestCommon) {
                anchorCheck = this.getElemTypesInPath(activeElems, value.path).anchor;
                if (anchorCheck.length > 1) {
                  for (let i in anchorCheck) {
                    if (anchorCheck[i].id === commonCandidates.bestAnchor.id) {
                      candidateValues.bestCommon = value.matchVal;
                      commonCandidates.bestCommon = value;
                      break;
                    }
                  }
                } else if (anchorCheck.length > -1 && anchorCheck[0].id === commonCandidates.bestAnchor.id) {
                  // yep, has anchor that matches the best anchor
                  candidateValues.bestCommon = value.matchVal;
                  commonCandidates.bestCommon = value;
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

  addBodyElements(elems, store) {
    if (!store) store = this.store$.getValue();
    let elemData = {}, newElems = {};
    let newIds = [];
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
      newIds.push(id);
    }
    const setState = this.setState.bind(this);
    return {
      ids: newIds,
      add$: Rx.Observable.create((observer) => {
        const callback = () => {observer.complete()};
        setState((prevState, props) => {
          let newState = {...prevState};
          newState.bodyElements = {...prevState.bodyElements, ...newElems};
          newState.nonce = this.getNonce();
          console.log('newState = ', newState);
          return newState;
        }, callback);
      }),
    }
  }

  removeBodyElements(ids) {
    const setState = this.setState.bind(this);
    return Rx.Observable.create((observer) => {
      const callback = () => {observer.complete()};
      setState((prevState, props) => {
        let newState = {...prevState};
        for(let i in ids) {
          delete newState.bodyElements[ids[i]];
        }
        newState.nonce = this.getNonce();
        return newState;
      }, callback);
    });
  }

  render() {
    console.log('mdTransitionConnect Rendering = ', this.state.bodyElements);
    let render = [];
    if (this.state.bodyElements) {
      forOwn(this.state.bodyElements, (elemData, key, obj) => {
        console.log('render elemData = ', elemData);
        if (elemData.renderComponent) {
          render.push(elemData.renderComponent(elemData));
        } else {
          render.push(<MdTransitionBodyElement {...elemData} />);
        }
      });
    }
    render.push(
      <MdTransitionBodyElement key="root" isRoot update={this.state.nonce !== this.nonce ? false : true} {...this.props}>
        {this.props.children}
      </MdTransitionBodyElement>
    );
    this.nonce = this.state.nonce;
    return (<div>{render}</div>);

    render.push(
      <div key="fixedTestContainer" style={{position: 'absolute', top: `${15}px`, width: `${500}px`, height: `${500}px`, overflow: 'hidden'}}>
        <MdTransitionBodyElement key="fixedTest" update={true} style={{position: 'fixed', top: 0, width: `${1720}px`, height: `${1000}px`}}>
          <div><div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem consectetur et exercitationem id,
              nesciunt sint ullam ut voluptates. Beatae eligendi enim esse expedita libero molestiae perspiciatis quidem
              temporibus, ut velit?
            </div>
            <div>Aliquam aliquid beatae consequatur debitis delectus et eum illum iure labore minima molestiae officiis,
              quasi quo tenetur voluptatum! Animi at commodi doloremque exercitationem magnam praesentium quam ratione
              repellat ullam voluptate.
            </div>
            <div>Aut fuga qui reiciendis. Accusantium aspernatur assumenda consectetur consequuntur debitis, dignissimos
              ducimus earum enim facere illum itaque quam quos recusandae vel velit vero voluptates. Dolore natus neque
              pariatur sed sequi.
            </div>
            <div>Asperiores aut commodi consectetur delectus deleniti eaque eius eum facere fugiat illum molestiae
              molestias, mollitia nobis porro quam quia repellendus sunt tempora ut vero. Alias eligendi est in quos
              repudiandae.
            </div>
            <div>Assumenda at consequatur dicta dignissimos dolores, eos exercitationem harum incidunt itaque iure libero
              minima mollitia necessitatibus nihil odio officia omnis optio quaerat quisquam quos sapiente temporibus
              velit? Aut, perspiciatis, reprehenderit.
            </div>
            <div>Animi deserunt distinctio dolor fuga perspiciatis quis tenetur? Ea illo ipsa minus? Accusantium alias
              aliquid at exercitationem nesciunt officia perspiciatis possimus praesentium quae quasi, ratione reiciendis
              repudiandae, similique vel veniam?
            </div>
            <div>Eveniet laboriosam optio quaerat quisquam rerum, ullam vitae! Architecto cum facilis laboriosam maxime
              minus molestiae necessitatibus nemo omnis placeat, quae quam quasi quia repellat, saepe similique soluta
              tempora vel. At.
            </div>
            <div>Ab aut, error necessitatibus nemo nobis nostrum quisquam rem reprehenderit sed suscipit. Eum harum
              mollitia praesentium provident sint vel voluptatibus! Ab dolores excepturi laboriosam nam officia qui
              voluptatibus. Dolore, pariatur.
            </div>
            <div>Alias minima officiis provident quisquam repudiandae? Ad aliquam architecto aspernatur atque beatae
              commodi consequuntur cupiditate doloremque dolores est facilis ipsam maiores molestiae, molestias nesciunt,
              pariatur, perferendis porro quis repellendus tempore?
            </div>
            <div>A accusamus aliquam asperiores aut consectetur dicta dignissimos, doloremque enim ex expedita fugit, id
              labore magnam modi, mollitia numquam saepe tempora unde voluptatem voluptatum? Ducimus eos nam odit
              praesentium voluptatibus.
            </div></div></div>
        </MdTransitionBodyElement>
      </div>
    )
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
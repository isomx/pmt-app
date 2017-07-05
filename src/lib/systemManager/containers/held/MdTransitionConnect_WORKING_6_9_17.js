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
import TimelineMax from 'gsap/TimelineMax';
import CustomEase from 'gsap/CustomEase';

import { actionTypes } from '../actions/actionTypes';
import { registerApiHandler } from '../actions/apiActions';

// import difference from 'lodash/difference';
// import { createChildStream, createInternalKey, source$ } from '../observables/transitions';
// import uniqueId from 'lodash/uniqueId';

const mdStandardEase = new CustomEase('mdStandardEase', '0.4, 0.0, 0.2, 1');


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
    this.getNonce = this.getNonce.bind(this);
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
        const pElem = store[store[ids[i]]] ? store[store[ids[i]].parentId] : null;
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
    if (!store[id]) return store;
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
          this.removeElemAndChildren(elems, action.payload.id, true);
          this.store$.next(elems);
        }
        break;
      case actionTypes.GROUP_WILL_UPDATE:
        console.log('GROUP_WILL_UPDATE = ', action.payload);
        if (!this.updateInProgress) {
          this.updateInProgress = true;
          let toTransition = {
            idsToLeave: [],
            idsToEnter: [],
            transTypes: {
              anchorAndCommon: [],
              anchorOnly: [],
            }
          };
          const listenForId = action.payload.id;
          let groupUpdate$ = [];
          const updater = Rx.Observable.create((observer) => {
            this.updateObserver = observer;
          });
          const compile$ = updater
            .map((act) => {
              if (act.type === actionTypes.GROUP_DID_UPDATE) {
                toTransition[act.payload.id] = {
                  id: act.payload.id,
                  transitionType: act.payload.transitionType,
                  handleUpdate: act.payload.handleUpdate,
                };
                groupUpdate$.push(act.payload.handleUpdate);
                toTransition.idsToLeave.push(...act.payload.idsToLeave);
                toTransition.idsToEnter.push(...act.payload.idsToEnter);
                switch(act.payload.transitionType) {
                  case transitionTypes.ANCHOR_COMMON_ELEMENT:
                    toTransition.transTypes.anchorAndCommon.push(act.payload.id);
                    toTransition.transTypes.anchorOnly.push(act.payload.id);
                    break;
                  case transitionTypes.ANCHOR_ONLY:
                    toTransition.transTypes.anchorOnly.push(act.payload.id);
                    break;
                  default:
                }
              }
              return act;
            })
            .takeWhile((act) => act.type === actionTypes.GROUP_DID_UPDATE && act.payload.id === listenForId ? false : true);
          const transComplete = () => {
            this.updateInProgress = false;
            this.recordedPosition = null;
            this.updateObserver.complete();
            this.updateObserver = null;
          }
          const compileSubscribe = compile$.subscribe(
            (val) => console.log('compileSubscribe val = ', val),
            (err) => console.log('compileSubscribe err = ', err),
            () => {
              console.log('compileSubscribe complete');
              console.log('toTransition = ', toTransition);
              let elems = this.store$.getValue(), activeElems;
              if (toTransition.idsToLeave.length > 0) {
                activeElems = this.removeElemsAndChildren(elems, toTransition.idsToLeave);
              } else {
                activeElems = elems;
              }
              const doTransition$ = Rx.Observable.merge(...groupUpdate$);
              const transition$ = this.prepareTransitionData(toTransition, elems, activeElems);
              //const startTrans$ = Rx.Observable.concat(doTransition$, transition$)
              transition$.subscribe(
                (val) => console.log('transition$ subscribe val = ', val),
                (err) => console.log('transition$ subscribe err = ', err),
                () => {
                  console.log('transition$ subscribe complete');
                  doTransition$.subscribe(
                    (val) => {
                      console.log('merged transition obs val = ', val)
                    },
                    (err) => {
                      console.log('merged transition obs err = ', err)
                    },
                    () => {
                      console.log('transition obs complete');
                      transComplete();
                    }
                  );
                }
              );
            }
          );
        }
        break;
      case actionTypes.GROUP_DID_UPDATE:
        if (this.updateInProgress && this.updateObserver) this.updateObserver.next(action);
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

  prepareTransitionData(toTransition, allElems, activeElems) {
    let bestPath, bestGroupVal = -2, bestGroupChildVal = -2, bestGroupId, bestGroupChildId, gIndex, gcIndex;
    let bestAnchor, bestCommon;
    let transitionData = {};
    let motionTrans$;
    if (toTransition.transTypes.anchorOnly.length > 0 && this.recordedPosition) {
      const recPos = {...this.recordedPosition};
      const transElemResp = this.findTransitionElems(allElems, activeElems, recPos, toTransition.transTypes.anchorAndCommon.length > 0);
      if (transElemResp.bestAnchor) {
        let typesInPath;
        bestAnchor = transElemResp.bestAnchor;
        if (transElemResp.bestCommon) {
          bestCommon = transElemResp.bestCommon;
          typesInPath = this.getElemTypesInPath(activeElems, bestCommon.path, true, false);
        } else {
          typesInPath = this.getElemTypesInPath(activeElems, bestAnchor.path, true, false);
        }
        let unhideGroupChildRefs = [], refResp, gcParentGroup;
        if (typesInPath && typesInPath.groupChild) {
          // check if the anchor/commonElement is within a hidden groupChild because it just entered
          for (let i = 0, gcLength = typesInPath.groupChild.length; i < gcLength; i++) {
            gcIndex = toTransition.idsToEnter.indexOf(typesInPath.groupChild[i]);
            if (gcIndex > -1) {
              // found, get ref to unhide it before animation begins
              gcParentGroup = activeElems[toTransition.idsToEnter[gcIndex]].parentId;
              if (activeElems[gcParentGroup]) {
                refResp = activeElems[gcParentGroup].receiveDispatch({
                  type: actionTypes.GROUP_GET_CHILD_REF,
                  payload: {
                    groupChildId: toTransition.idsToEnter[gcIndex],
                  }
                });
                if (refResp) {
                  unhideGroupChildRefs.push(refResp);
                }
              }
            }
          }
        }
        motionTrans$ = this.prepareAnchorTransition({elem: bestAnchor}, bestCommon ? { elem: bestCommon} : null, allElems, activeElems, unhideGroupChildRefs);



        /**
        // Find best group to route the motion transition to. This is so it can "unhide"
        // the entering 'groupChild' that contains the matched elems before doing the transition.
        forOwn(toTransition, (val, gId) => {
          gIndex = bestPath.indexOf(gId);
          if (gIndex > bestGroupVal) {
            if (bestGroupId) {
              //one already assigned, remove it.
              delete toTransition[bestGroupId].transitionData;
            }
            bestGroupId = gId;
            let gChildIds = activeElems[gId].childIds;
            // Originally I thought you should check that childIds.length > 0, in case a group renders 0 children
            // only to animate out the existing groupChildren. But in that case, there'd be no way a commonElement
            // or anchor would be a match for the group, since nothing would be "seen" during the process of
            // finding the best matching commonElement/anchor (because activeElems only includes what will remain on page)
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
        });

        if (bestGroupId) {
          // successfully assigned transition to group/child. Compile dimensions
          if (toTransition[bestGroupId].transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT || toTransition[bestGroupId].transitionType === transitionTypes.ANCHOR_ONLY) {
            toTransition[bestGroupId].transitionData = this.prepareMotionTransition(toTransition[bestGroupId].transitionData, allElems, activeElems);
          }
        }
         **/
      }
    }
    let transition$;
    if (motionTrans$) {
      transition$ = Rx.Observable.concat(motionTrans$);
    } else {
      transition$ = Rx.Observable.empty();
    }
    return transition$;
  }

  prepareAnchorTransition(toAnchor, toCommon, allElems, activeElems, unhideGroupChildRefs) {
    if (!toAnchor) return Rx.Observable.empty();
    const duration = 1.3;
    let scrollData = this.getScrollData();
    let toId, fromId, toResp, fromResp;
    toId = toAnchor.elem.id;
    fromId = toAnchor.elem.matchId;
    /**
     * For the toAnchor, go ahead and get the rect so the receiving transition groupChild can scroll to it before
     * initiating the observables. This will greatly reduce the math necessary, since then all the rect returned
     * through the observables will be accurate without the need to adjust for scroll
     */
    toResp = activeElems[toId].receiveDispatch({type: actionTypes.ANCHOR_PREPARE_TRANS, payload: {to: true, scrollData, addToScroll: -88,}});
    fromResp = allElems[fromId].receiveDispatch({type: actionTypes.ANCHOR_PREPARE_TRANS, payload: {to: false, scrollData, addToScroll: -88,}});
    if (toResp && fromResp) {
      let newBodyElems, fromAnchor, fromCommon, toAnchorRender$, fromAnchorRender$, animation$, commonCopyRef, animComplete$;
      let tl, toAnchorRef, fromAnchorRef, toAnchorContainerRef, fromAnchorContainerRef, toCommonRef, fromCommonRef, domNode, fromAnchorHTML, toAnchorHTML, toCommonHTML, fromCommonHTML;

      let _toAnchorRef, _fromAnchorRef, _toAnchorContainerRef, _fromAnchorContainerRef, _toCommonRef, _fromCommonRef;

      let commonXOffset = 0, commonYOffset = 0;

      const reverse = (toResp.rect.width + toResp.rect.height) < (fromResp.rect.width + fromResp.rect.height) ? true : false;
      let newScroll = toResp.rect.top + scrollData.scrollTop + -88;
      if (newScroll < 0) newScroll = 0;
      const scrollChange = newScroll - scrollData.scrollTop;
      console.log('scrollChange = ', scrollChange);
      console.log('newScroll = ', newScroll);
      document.documentElement.scrollTop = document.body.scrollTop = newScroll;
      scrollData.scrollTop = newScroll;
      toResp.rect.top = toResp.rect.top - scrollChange;
      toAnchor.data = {...toResp};
      fromAnchor = {
        elem: allElems[fromId],
        data: {...fromResp},
      };
      newBodyElems = [
        { // overlay to avoid screen interaction
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            height: `${scrollData.viewPortHeight}px`,
            width: `${scrollData.viewPortWidth}px`,
            opacity: 0,
            zIndex: 500,
            //backgroundColor: '#000',
            opacity: 1,
          },
          component: 'div',
          onClick: (e) => {
            e.preventDefault();
            if (!tl.paused()) {
              tl.pause()
            } else {
              tl.play();
            }
          }
        }
      ];
      if (toCommon) {
        toId = toCommon.elem.id;
        fromId = toCommon.elem.matchId;
        toResp = activeElems[toId].receiveDispatch({type: actionTypes.COMMON_PREPARE_TRANS, payload: {to: true, getCopy: true}});
        fromResp = allElems[fromId].receiveDispatch({type: actionTypes.COMMON_PREPARE_TRANS, payload: {to: false}});
        if (toResp && fromResp) {
          toResp.rect.top = toResp.rect.top + scrollData.scrollTop;
          fromResp.rect.top = fromResp.rect.top + scrollData.scrollTop;
          toCommon.data = {...toResp};
          fromCommon = {
            elem: allElems[fromId],
            data: {...fromResp},
          };
          domNode = fromCommon.data.getRef();
          if (domNode) {
            fromCommonHTML = domNode.cloneNode(true).innerHTML;
            newBodyElems.push({
              render: (data) => {
                const style = {
                  position: 'absolute',
                  top: `${fromCommon.data.rect.top}px`,
                  left: `${fromCommon.data.rect.left}px`,
                  height: `${fromCommon.data.rect.height}px`,
                  width: `${fromCommon.data.rect.width}px`,
                  zIndex: 3,
                };
                return (
                  <div key={`fromCommon_${data.id}`} ref={(ref) => _fromCommonRef = ref} style={style} dangerouslySetInnerHTML={{__html: fromCommonHTML}} />
                );
              }
            });
          }
        }
      }
      const toStyle = toAnchor.data.rect.style;
      const fromStyle = fromAnchor.data.rect.style;
      if (reverse) {
        domNode = fromAnchor.data.getRef();
        if (domNode) {
          fromAnchorHTML = domNode.cloneNode(true).outerHTML;
          if (toCommon && fromCommon) {
            commonXOffset = toCommon.data.rect.left - fromCommon.data.rect.left;
            console.log('commonXOffset = ', commonXOffset);
            console.log('commonXOffset w/Anchor = ', commonXOffset - fromAnchor.data.rect.left);
            commonXOffset -= fromAnchor.data.rect.left;
            commonYOffset = toCommon.data.rect.top - fromCommon.data.rect.top;
            console.log('commonYOffset = ', commonYOffset);
            commonYOffset -= fromAnchor.data.rect.top;
            console.log('commonYOffset w/Anchor = ', commonYOffset);
          }
          newBodyElems.push({
            render: (data) => {
              const style = {
                position: 'absolute',
                top: `${0}px`,
                left: `${0}px`,
                height: `${fromAnchor.data.rect.height}px`,
                width: `${fromAnchor.data.rect.width}px`,
                visibility: 'visible',
                opacity: 1,
              };
              console.log('fromStyle = ', fromStyle);
              const containerStyle = {
                overflow: 'hidden',
                position: 'absolute',
                //top: `${newScroll + 88 - fromStyle.margin.top - fromStyle.margin.bottom - fromStyle.padding.top - fromStyle.padding.bottom}px`,
                //left: `${0}px`,
                //top: `${fromAnchor.data.rect.top + newScroll - fromStyle.margin.top - fromStyle.margin.bottom - fromStyle.padding.top - fromStyle.padding.bottom}px`,
                top: `${fromAnchor.data.rect.top + newScroll}px`,
                left: `${fromAnchor.data.rect.left}px`,
                height: `${fromAnchor.data.rect.height}px`,
                width: `${fromAnchor.data.rect.width}px`,
                visibility: 'visible',
                opacity: 1,
                backgroundColor: '#fafafa',
                zIndex: 2,
              };
              return (
                <div ref={(ref) => _fromAnchorContainerRef = ref} key={`fromAnchorContainer_${data.id}`} id={`fromAnchorContainer_${data.id}`} style={containerStyle}>
                  <div ref={(ref) => _fromAnchorRef = ref} id={`fromAnchor_${data.id}`} style={style} dangerouslySetInnerHTML={{__html: fromAnchorHTML}} />
                </div>
              );
            }
          });
        }
        animComplete$ = fromAnchor.data.transComplete$;
        animation$ = Rx.Observable.create((observer) => {
          const completeCallback = () => observer.complete();
          tl = new TimelineMax({paused: true, onComplete: completeCallback});
          toAnchorRef = toAnchor.data.getRef();
          fromAnchorRef = fromAnchor.data.getRef();
          if (!toAnchorRef || !_fromAnchorRef || !_fromAnchorContainerRef) {
            observer.complete();
            return;
          }
          toCommonRef = toCommon.data.getRef();
          TweenMax.set(unhideGroupChildRefs, {opacity: 1});
          tl.set(toCommonRef, {opacity: 0})
            .set(fromAnchorRef, {opacity: 0})

            // toAnchorRef
            .set(toAnchorRef, {opacity: 0, zIndex: 2})
            .to(toAnchorRef, duration * 0.333, {opacity: 1}, duration * 0.2)
            .from(toAnchorRef, duration * .75, {
              y: fromAnchor.data.rect.top - toAnchor.data.rect.top,
              ease: mdStandardEase,
            }, 0)
            .from(toAnchorRef, duration * .85, {
              x: fromAnchor.data.rect.left - toAnchor.data.rect.left,
              ease: mdStandardEase,
            }, duration * .15)
            .to(toAnchorRef, duration * .333, {opacity: 1}, duration * 0.2)

            // fromAnchorContainerRef
            .to(_fromAnchorContainerRef, duration * .75, {
              height: toAnchor.data.rect.height,
              y: -fromAnchor.data.rect.top - fromStyle.margin.top - fromStyle.margin.bottom - fromStyle.padding.top - fromStyle.padding.bottom + toAnchor.data.rect.top + toStyle.margin.top + toStyle.margin.bottom + toStyle.padding.top + toStyle.padding.bottom,
              ease: mdStandardEase,
            }, 0)
            .to(_fromAnchorContainerRef, duration * .85, {
              width: toAnchor.data.rect.width,
              x: -fromAnchor.data.rect.left - fromStyle.margin.left - fromStyle.margin.right - fromStyle.padding.left - fromStyle.padding.right + toAnchor.data.rect.left + toStyle.margin.left + toStyle.margin.right + toStyle.padding.left + toStyle.padding.right,
              ease: mdStandardEase,
            }, duration * .15)

            // fromAnchorRef
            .to(_fromAnchorRef, duration * .4, {opacity: 0}, 0)
            .to(_fromAnchorRef, duration * .75, {
              y: -toStyle.margin.top - toStyle.margin.bottom - toStyle.padding.top - toStyle.padding.bottom,
              ease: mdStandardEase,
            }, 0)
            .to(_fromAnchorRef, duration * .85, {
              x: -toStyle.margin.left - toStyle.margin.right - toStyle.padding.left - toStyle.padding.right,
              ease: mdStandardEase,
            }, duration * .15)

            //commonCopy
            .to(_fromCommonRef, duration * .75, {
              height: toCommon.data.rect.height,
              y: toCommon.data.rect.top - fromCommon.data.rect.top,
              ease: mdStandardEase,
            }, 0)
            .to(_fromCommonRef, duration * .85, {
              x: toCommon.data.rect.left - fromCommon.data.rect.left,
              width: toCommon.data.rect.width,
              ease: mdStandardEase,
            }, duration * .15)
            .set(toCommonRef, {opacity: 1})
            .set(toAnchorRef, {zIndex: 0});
          tl.play(0);
          setTimeout(() => {
            //tl.pause();
          }, 8000);
        });
      } else {
        if (toCommon) {
          domNode = toCommon.data.getRef();
          if (domNode) TweenMax.set(domNode, {opacity: 0});
        }
        domNode = toAnchor.data.getRef();
        if (domNode) {
          toAnchorHTML = domNode.cloneNode(true).outerHTML;
          console.log('toAnchorHTML = ', toAnchorHTML);

          if (toCommon && fromCommon) {
            commonXOffset = fromCommon.data.rect.left - toCommon.data.rect.left;
            console.log('commonXOffset = ', commonXOffset);
            console.log('commonXOffset w/Anchor = ', commonXOffset - fromAnchor.data.rect.left);
            commonXOffset -= fromAnchor.data.rect.left + 88;
            commonYOffset = fromCommon.data.rect.top - toCommon.data.rect.top;
            console.log('commonYOffset = ', commonYOffset);
            commonYOffset -= fromAnchor.data.rect.top;
            console.log('commonYOffset w/Anchor = ', commonYOffset);


          }
          newBodyElems.push({
            render: (data) => {
              const style = {
                position: 'absolute',
                top: `${0}px`,
                left: `${0}px`,
                height: `${toAnchor.data.rect.height}px`,
                width: `${toAnchor.data.rect.width}px`,
                zIndex: 2,
                visibility: 'visible',
                transform: `translate(${commonXOffset - toStyle.margin.left - toStyle.margin.right - toStyle.padding.left - toStyle.padding.right}px, ${-toStyle.margin.top - toStyle.margin.bottom - toStyle.padding.top - toStyle.padding.bottom }px`,
                opacity: 0,
              };
              const containerStyle = {
                overflow: 'hidden',
                position: 'absolute',
                top: `${0}px`,
                left: `${0}px`,
                height: `${fromAnchor.data.rect.height}px`,
                width: `${fromAnchor.data.rect.width}px`,
                zIndex: 2,
                visibility: 'visible',
                backgroundColor: '#fafafa',
                transform: `translate(${fromAnchor.data.rect.left}px, ${fromAnchor.data.rect.top}px`,
                opacity: 0,
              };
              return (
                <div ref={(ref) => _toAnchorContainerRef = ref} key={`toAnchorContainer_${data.id}`} id={`toAnchorContainer_${data.id}`} style={containerStyle}>
                  <div ref={(ref) => _toAnchorRef = ref} id={`toAnchor_${data.id}`} style={style} dangerouslySetInnerHTML={{__html: toAnchorHTML}} />
                </div>
              );
            }
          });
          animComplete$ = toAnchor.data.transComplete$;
          animation$ = Rx.Observable.create((observer) => {
            const completeCallback = () => {
              TweenMax.set(toCommonRef, {opacity: 1});
              observer.complete();
            }
            tl = new TimelineMax({paused: true, onComplete: completeCallback});
            fromAnchorRef = fromAnchor.data.getRef();
            if (!_toAnchorRef || !_toAnchorContainerRef || !fromAnchorRef) {
              observer.complete();
              return;
            }
            toCommonRef = toCommon.data.getRef();
            fromCommonRef = fromCommon.data.getRef();
            TweenMax.set(fromCommonRef, {opacity: 0});
            TweenMax.set(unhideGroupChildRefs, {opacity: 1});
            tl

              // fromAnchorRef
              .to(fromAnchorRef, duration * .75, {
                x: toAnchor.data.rect.left - fromAnchor.data.rect.left,
                ease: mdStandardEase,
              }, 0)
              .to(fromAnchorRef, duration * .85, {
                y: toAnchor.data.rect.top - fromAnchor.data.rect.top,
                ease: mdStandardEase,
              }, duration * .15)

              // toAnchorContainerRef
              .to(_toAnchorContainerRef, duration * .75, {
                width: toAnchor.data.rect.width,
                x: toAnchor.data.rect.left,
                ease: mdStandardEase,
              }, 0)
              .to(_toAnchorContainerRef, duration * .85, {
                height: toAnchor.data.rect.height,
                y: toAnchor.data.rect.top,
                ease: mdStandardEase,
              }, duration * .15)
              .to(_toAnchorContainerRef, duration * .2, {opacity: 1, onComplete: () => {tl.kill(null, fromAnchorRef)}}, 0)

              // toAnchorRef
              .to(_toAnchorRef, duration * .333, {opacity: 1}, duration * 0.2)
              .to(_toAnchorRef, duration * .75, {
                x: 0,
                ease: mdStandardEase,
              }, 0)
              .to(_toAnchorRef, duration * .85, {
                y: 0,
                ease: mdStandardEase,
              }, duration * .15)

              //commonCopy
              .to(_fromCommonRef, duration * .75, {
                x: toCommon.data.rect.left - fromCommon.data.rect.left,
                width: toCommon.data.rect.width,
                ease: mdStandardEase,
              }, 0)
              .to(_fromCommonRef, duration * .85, {
                height: toCommon.data.rect.height,
                y: toCommon.data.rect.top - fromCommon.data.rect.top,
                ease: mdStandardEase,
              }, duration * .15)
              .set(toCommonRef, {opacity: 1});
            tl.play(0);
          });
        }
      }
      const addBodyElemsResp = this.addBodyElements(newBodyElems);
      const bodyElementIds = addBodyElemsResp.ids;
      const addBodyElements$ = addBodyElemsResp.add$;
      const removeBodyElements$ = this.removeBodyElements(bodyElementIds);
      const completeStream$ = Rx.Observable.merge(removeBodyElements$, animComplete$);
      const motionStream$ = Rx.Observable.concat(addBodyElements$, animation$, completeStream$);

      return motionStream$;

      if (!toAnchorRender$) toAnchorRender$ = Rx.Observable.empty();
      if (!fromAnchorRender$) fromAnchorRender$ = Rx.Observable.empty();
      const renderStream$ = Rx.Observable.merge(addBodyElements$, toAnchorRender$, fromAnchorRender$);
      // const motionStream$ = Rx.Observable.concat(toAnchorRender$, fromAnchorRender$);
      return motionStream$;

    }

  }

  prepareMotionTransition(transData, allElems, activeElems) {
    let toId, fromId, toResp, fromResp;
    let scrollData = this.getScrollData();
    if (transData.toAnchor) {
      toId = transData.toAnchor.elem.id;
      fromId = transData.toAnchor.elem.matchId;
      /**
       * For the toAnchor, go ahead and get the rect so the receiving transition groupChild can scroll to it before
       * initiating the observables. This will greatly reduce the math necessary, since then all the rect returned
       * through the observables will be accurate without the need to adjust for scroll
       */
      toResp = activeElems[toId].receiveDispatch({type: actionTypes.ANCHOR_PREPARE_TRANS, payload: {to: true, scrollData, addToScroll: -88,}});
      fromResp = allElems[fromId].receiveDispatch({type: actionTypes.ANCHOR_PREPARE_TRANS, payload: {to: false, scrollData,}});
      if (toResp && fromResp) {
        transData.addBodyElements = this.addBodyElements;
        transData.removeBodyElements = this.removeBodyElements;
        transData.toAnchor.data = {...toResp};
        // toResp.ref.scrollIntoView();
        transData.fromAnchor = {
          elem: allElems[fromId],
          data: {...fromResp},
        }
        if (transData.toCommonElement) {
          toId = transData.toCommonElement.elem.id;
          fromId = transData.toCommonElement.elem.matchId;
          toResp = activeElems[toId].receiveDispatch({type: actionTypes.COMMON_PREPARE_TRANS, payload: {to: true, from: false, getCopy: true}});
          fromResp = allElems[fromId].receiveDispatch({type: actionTypes.COMMON_PREPARE_TRANS, payload: {to: false, from: true}});
          if (toResp && fromResp) {
            transData.toCommonElement.data = {...toResp};
            transData.fromCommonElement = {
              elem: allElems[fromId],
              data: {...fromResp},
            }
          } else {
            // necessary responses not received, cannot use it.
            delete transData.toCommonElement;
          }
        }
      } else {
        // necessary responses not received, cannot use it.
        delete transData.toAnchor;
      }
    }
    return transData;
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
    let indexVal, matchId, anchorCheck;
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
                if (commonCandidates.bestCommon.id) {
                  commonCandidates.bestCommon = {};
                  candidateValues.bestCommon = 0;
                }
              }
              break;
            case 'commonElement':
              if (anchorAndCommon && commonCandidates.bestAnchor.id && value.matchVal > candidateValues.bestCommon) {
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
    if (!commonCandidates.bestAnchor.id) delete commonCandidates.bestAnchor;
    if (!commonCandidates.best.id) delete commonCandidates.best;
    if (!commonCandidates.bestCommon.id) delete commonCandidates.bestCommon;
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
          return newState;
        }, callback);
      }),
    }
  }

  removeBodyElements(ids) {
    const setState = this.setState.bind(this);
    return Rx.Observable.create((observer) => {
      const cb = () => observer.complete();
      setState((prevState, props) => {
        let newState = {...prevState};
        for(let i in ids) {
          delete newState.bodyElements[ids[i]];
        }
        newState.nonce = this.getNonce();
        return newState;
      }, cb);
    });
  }

  render() {
    let render = [];
    if (this.state.bodyElements) {
      forOwn(this.state.bodyElements, (elemData, key, obj) => {
        render.push(<MdTransitionBodyElement {...elemData} />);
      });
    }
    render.push(
      <MdTransitionBodyElement key="root" update={this.state.nonce != this.nonce ? false : true} {...this.props}>
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
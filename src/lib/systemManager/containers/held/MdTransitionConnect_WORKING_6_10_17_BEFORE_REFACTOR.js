/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MdTransitionBodyElement from '../components/RootBodyElement';
import { transitionTypes } from '../actions/transitionTypes';
import Rx from 'rxjs/Rx';
import uniqueId from 'lodash/uniqueId';
import forOwn from 'lodash/forOwn';
import { handleTransitions } from '../services/transitions/manager';

import { actionTypes } from '../actions/actionTypes';
import { registerApiHandler } from '../actions/apiActions';


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
    this.setState = this.setState.bind(this);
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
            idsToAppear: [],
            transTypes: {
              surfaceExpand: [],
              surfaceMorph: [],
            },
            groupUpdate$: [],
          };
          const listenForId = action.payload.id;
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
                toTransition.groupUpdate$.push(act.payload.handleUpdate);
                toTransition.idsToLeave.push(...act.payload.idsToLeave);
                toTransition.idsToEnter.push(...act.payload.idsToEnter);
                // toTransition.idsToAppear.push(...act.payload.idsToAppear);
                switch(act.payload.transitionType) {
                  case transitionTypes.ANCHOR_COMMON_ELEMENT:
                    toTransition.transTypes.surfaceExpand.push(act.payload.id);
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
              toTransition.allElems = elems;
              toTransition.activeElems = activeElems;
              toTransition.recordedPosition = this.recordedPosition;
              toTransition.scrollData = this.getScrollData();
              toTransition.addBodyElements = this.addBodyElements;
              toTransition.removeBodyElements = this.removeBodyElements;

              const transition$ = handleTransitions(toTransition);
              transition$.subscribe(
                (val) => console.log('transition$ subscribe val = ', val),
                (err) => console.log('transition$ subscribe err = ', err),
                () => {
                  console.log('transition$ subscribe complete');
                  transComplete();
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

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
      mdTransitionDispatch: this.receiveDispatch,
    }
  }

  addBodyElements(elems, store) {
    if (!store) store = this.store$.getValue();
    let elemData, newElems = {};
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
    const setState = this.setState;
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
    const setState = this.setState;
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
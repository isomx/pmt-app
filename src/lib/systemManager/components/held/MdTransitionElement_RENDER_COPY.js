/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../actions/actionTypes';
import MdTransitionBodyElement from './RootBodyElement';
import Rx from 'rxjs';

export default class MdTransitionElement extends Component {
  constructor(props, context) {
    super(props, context);
    this.registerRef = this.registerRef.bind(this);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.isMounted = this.isMounted.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
      this.dispatch = this.context.mdTransitionDispatch;
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'commonElement',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: this.props.name,
        }
      });
    }
    this.state = {
      transitioning: false,
      style: {},
    };
  }

  getRef() {
    console.log('GETTING REF IN MdTransitionElement, ref = ', this.ref);
    return this.ref;
  }

  isMounted() {
    // ensures the transComplete$ observable won't try to set state on an unmounted component
    return this.mounted ? true : false;
  }

  getElemPosition(scrollData) {
    if (this.ref) {
      const rect = this.ref.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        height: rect.height,
        width: rect.width,
      }
    }
  }

  shouldComponentUpdate() {
    return !this.state.transitioning;
  }

  receiveDispatch(action) {
    switch(action.type) {
      case actionTypes.COMMON_ELEMENT_GET_ELEM:
        if (this.elem) {
          return { ref: this.elem, children: this.props.children }
        }
        break;
      case actionTypes.COMMON_PREPARE_TRANS:
        const { to, from, scrollData, style } = action.payload;
        const id = this.id;
        const rect = this.getElemPosition();
        const setState = this.setState.bind(this);
        const isMounted = this.isMounted;
        console.log('MdTransitionElement ref = ', this.ref);
        return {
          rect,
          getRef: this.getRef.bind(this),
          render$: Rx.Observable.create((observer) => {
            const callback = () => {
              observer.next({
                type: actionTypes.COMMON_PREPARE_TRANS_RESP_RENDER,
                payload: {
                  id,
                }
              });
              observer.complete();
            }
            setState({transitioning: true, style}, callback);
          }),
          transComplete$: Rx.Observable.create((observer) => {
            const callback = () => {
              observer.complete();
            };
            if (isMounted()) {
              setState({transitioning: false, style: {}}, callback);
            } else {
              observer.complete();
            }
          }),
        };
        break;
      default:
    }

  }

  componentWillMount() {

  }

  componentDidMount() {
    this.mounted = true; // ensures the transComplete$ observable won't try to set state on an unmounted component
  }

  componentWillUnmount() {
    this.mounted = false; // ensures the transComplete$ observable won't try to set state on an unmounted component
    this.dispatch({
      type: actionTypes.DISCONNECT_COMPONENT,
      payload: {
        id: this.id,
      }
    });
  }

  registerRef(ref) {
    console.log('MdTransitionElement registerRef, ref = ', ref);
    if (ref) {
      this.ref = ref;
      /**
       const newElem = elem.cloneNode(true);
       document.body.append(newElem);
      if (this.state.runCount === 0) {
        this.setState({
          runCount: 1,
          elem: elem,
        });
      }
       // <div dangerouslySetInnerHTML={{__html: this.state.elem.innerHTML}} />
       **/
    }
  }

  render() {
    return (
      <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
        <MdTransitionBodyElement key="main" component="span" update={!this.state.transitioning}>
          {this.props.children}
        </MdTransitionBodyElement>
      </div>
    );
  }
}

MdTransitionElement.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}
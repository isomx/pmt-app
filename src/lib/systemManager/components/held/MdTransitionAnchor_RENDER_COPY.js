/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../actions/actionTypes';
import MdTransitionBodyElement from './RootBodyElement';
import Rx from 'rxjs';

export default class MdTransitionAnchor extends Component {
  constructor(props, context) {
    super(props, context);
    this.registerRef = this.registerRef.bind(this);
    this.registerContainerRef = this.registerContainerRef.bind(this);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.getRef = this.getRef.bind(this);
    this.getContainerRef = this.getContainerRef.bind(this);
    this.isMounted = this.isMounted.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
      this.dispatch = this.context.mdTransitionDispatch;
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'anchor',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: this.props.name,
        }
      });
    }
    this.state = {
      transitioning: false,
      style: {},
      containerStyle: {},
    };
  }

  getRef(){
    return this.ref;
  }

  getContainerRef() {
    return this.containerRef;
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
    return !this.state.transitioning; // block when transitioning
  }

  receiveDispatch(action) {
    switch(action.type) {
      case actionTypes.ANCHOR_GET_ELEM:
        if (this.elem) {
          return { ref: this.elem, children: this.props.children }
        }
        break;
      case actionTypes.ANCHOR_PREPARE_TRANS:
        let { to, scrollData, addToScroll } = action.payload;
        const rect = this.getElemPosition();
        if (to) {
          document.documentElement.scrollTop = document.body.scrollTop = rect.top + scrollData.scrollTop + addToScroll;
          rect.top += scrollData.scrollTop - scrollData.clientTop;
          rect.left += scrollData.scrollLeft - scrollData.clientLeft;
        }
        const id = this.id;
        let style = {};
        let zIndex = 0;
        const setState = this.setState.bind(this);
        return {
          rect,
          getRef: this.getRef,
          getContainerRef: this.getContainerRef,
          prepareRender: (style, containerStyle) => {
            const render$ = Rx.Observable.create((observer) => {
              const callback = () => {
                observer.next({
                  type: actionTypes.ANCHOR_PREPARE_TRANS_RESP_RENDER,
                  payload: {
                    id,
                  }
                });
                observer.complete();
              }
              setState({transitioning: true, style, containerStyle}, callback);
            });
            return render$;
          },
          render$: Rx.Observable.create((observer) => {
            const callback = () => {
              observer.next({
                type: actionTypes.ANCHOR_PREPARE_TRANS_RESP_RENDER,
                payload: {
                  id,
                }
              });
              observer.complete();
            }
            this.setState({transitioning: true, style}, callback);
          }),
          transComplete$: Rx.Observable.create((observer) => {
            if (this.isMounted()) {
              this.setState({transitioning: false, style: {}, containerStyle: {}}, observer.complete);
            } else {
              observer.complete();
            }
          }),
        };
      default:
    }
  }

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.mounted = true; // ensures the transComplete$ observable won't try to set state on an unmounted component
  }

  componentWillUnmount() {
    console.log('anchor ' + this.id + ' unmounting');
    this.mounted = false; // ensures the transComplete$ observable won't try to set state on an unmounted component
    this.dispatch({
      type: actionTypes.DISCONNECT_COMPONENT,
      payload: {
        id: this.id,
      }
    });
  }

  registerRef(ref) {
    if (ref) {
      this.ref = ref;
    }
  }

  registerContainerRef(ref) {
    if (ref) {
      this.containerRef = ref;
    }
  }

  render() {
    if (this.state.transitioning) {
      return (
        <div ref={(ref) => this.registerContainerRef(ref)} style={this.state.containerStyle}>
          <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
            <MdTransitionBodyElement key="main" component="div" update={!this.state.transitioning}>
              {this.props.children}
            </MdTransitionBodyElement>
          </div>
        </div>
      );
    } else {
      return (
        <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
          <MdTransitionBodyElement key="main" component="div" update={!this.state.transitioning}>
            {this.props.children}
          </MdTransitionBodyElement>
        </div>
      );
    }

  }
}
MdTransitionAnchor.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
}
MdTransitionAnchor.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}

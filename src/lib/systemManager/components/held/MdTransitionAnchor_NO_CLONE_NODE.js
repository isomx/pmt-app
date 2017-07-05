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
      const style = this.ref.currentStyle || window.getComputedStyle(this.ref);
      const compiledStyle = {
        margin: {
          left: parseInt(style["margin-left"]),
          right: parseInt(style["margin-right"]),
          top: parseInt(style["margin-top"]),
          bottom: parseInt(style["margin-bottom"])
        },
        padding: {
          left: parseInt(style["padding-left"]),
          right: parseInt(style["padding-right"]),
          top: parseInt(style["padding-top"]),
          bottom: parseInt(style["padding-bottom"])
        },
        border: {
          left: parseInt(style["border-left"]),
          right: parseInt(style["border-right"]),
          top: parseInt(style["border-top"]),
          bottom: parseInt(style["border-bottom"])
        }
      };
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        height: rect.height,
        width: rect.width,
        style: compiledStyle,
      }
    }
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
          /**
          document.documentElement.scrollTop = document.body.scrollTop = rect.top + scrollData.scrollTop + addToScroll;
          rect.top += scrollData.scrollTop - scrollData.clientTop + addToScroll;
          rect.left += scrollData.scrollLeft - scrollData.clientLeft;
          **/
        }
        const id = this.id;
        let style = {};
        let zIndex = 0;
        const setState = this.setState.bind(this);
        const isMounted = this.isMounted.bind(this);
        const forceUpdate = this.forceUpdate.bind(this);
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
          transComplete$: Rx.Observable.create((observer) => {
            if (isMounted()) {
              const cb = () => {
                console.log('anchor transComplete$, this.state = ', this.state);
                observer.complete();
              }
              console.log('isMounted, setting state');
              setState({transitioning: false, style: {}, containerStyle: {}}, cb);
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
    const { children, ...props } = this.props;
    props.style = {...props.style, ...this.state.style};
    props.componentRef = (ref) => {this.registerRef(ref);};
    delete props.name;
    let render = [];
    if (this.state.transitioning) {
      //className="md-paper--4"
      props.update = false;
      props.forAnchor = this.id;
      console.log('ANCHOR ' + this.id + ' Rendering, this.state.transitioning = ', this.state.transitioning);
      render.push(
        <MdTransitionBodyElement {...props} key="anchor">
          {children}
        </MdTransitionBodyElement>
      );
      return(
        <div ref={(ref) => this.registerContainerRef(ref)} style={this.state.containerStyle}>
          <MdTransitionBodyElement {...props} key="anchor">
            {children}
          </MdTransitionBodyElement>
        </div>
      );
      /**
      return(
        <div ref={(ref) => this.registerContainerRef(ref)} style={this.state.containerStyle}>
          <RootBodyElement key="main" component="span" update={!this.state.transitioning}>
            {renderedComp}
          </RootBodyElement>
        </div>
      );
      return (
        <div ref={(ref) => this.registerContainerRef(ref)} style={this.state.containerStyle}>
          <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
            <RootBodyElement key="main" component="span" update={!this.state.transitioning}>
              {renderedComp}
            </RootBodyElement>
          </div>
        </div>
      );
       **/
    } else {
      //React.createElement(RootBodyElement, props, children);
      props.forAnchor = this.id;

      return(
        <MdTransitionBodyElement {...props} key="anchor">
          {children}
        </MdTransitionBodyElement>
      );
       /**
      return render;
      return (
        <RootBodyElement {...props} key="anchor">
          {children}
        </RootBodyElement>
      );
       **/
      return (
        <div ref={(ref) => this.registerContainerRef(ref)}>
          <MdTransitionBodyElement {...props} key="anchor">
            {children}
          </MdTransitionBodyElement>
        </div>
      );





      return (
        <MdTransitionBodyElement key="main" component="span" update={!this.state.transitioning}>
          {renderedComp}
        </MdTransitionBodyElement>
      );
      return (
        <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
          <MdTransitionBodyElement key="main" component="span" update={!this.state.transitioning}>
            {renderedComp}
          </MdTransitionBodyElement>
        </div>
      );
    }
    /**
    if (this.state.transitioning) {
      return (
        <div ref={(ref) => this.registerContainerRef(ref)} style={this.state.containerStyle}>
          <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
            <RootBodyElement key="main" component="span" update={!this.state.transitioning}>
              {this.props.children}
            </RootBodyElement>
          </div>
        </div>
      );
    } else {
      return (
        <div ref={(ref) => this.registerRef(ref)} style={this.state.style}>
          <RootBodyElement key="main" component="span" update={!this.state.transitioning}>
            {this.props.children}
          </RootBodyElement>
        </div>
      );
    }
     **/

  }
}
MdTransitionAnchor.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
}
MdTransitionAnchor.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}

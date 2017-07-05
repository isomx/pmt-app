/**
 * This is a custom implementation of TransitionGroup (github: https://github.com/reactjs/react-transition-group)
 * and React Transition Group Plus (github: https://github.com/cheapsteak/react-transition-group-plus)
 * License MIT, React license under BSD
 */
/* eslint-disable */
import { chain } from '../utils/ChainFunction';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { getChildMapping, mergeChildMappings } from '../lib/systemManager/utils/ChildMapping';


class TransitionGroupCustom extends React.Component {
  static displayName = 'TransitionGroupCustom';

  constructor(props, context) {
    super(props, context);

    this.childRefs = Object.create(null);

    this.state = {
      children: getChildMapping(props.children),
    };
  }

  componentWillMount() {
    this.elemRect = {};
    this.currentlyEnteringOrEnteredKeys = {};
    this.currentlyEnteringKeys = {};
    this.currentlyEnteringPromises = {};
    this.currentlyLeavingKeys = {};
    this.currentlyLeavingPromises = {};
    this.pendingEnterCallbacks = {};
    this.pendingLeaveCallbacks = {};
    this.deferredLeaveRemovalCallbacks = [];
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.cancel = null;
    /**
    this.currentlyTransitioningKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
     **/
  }

  componentDidMount() {
    let initialChildMapping = this.state.children;
    for (let key in initialChildMapping) {
      if (initialChildMapping[key]) {
        this.performAppear(key);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('COMPONENT WILL RECEIVE PROPS');
    let nextChildMapping = getChildMapping(nextProps.children);
    let prevChildMapping = this.state.children;

    this.setState({
      children: mergeChildMappings(
        prevChildMapping,
        nextChildMapping,
      ),
    });

    for (let key in nextChildMapping) {
      let hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
      if (nextChildMapping[key] && ( !hasPrev || this.currentlyLeavingKeys[key])) {
        this.keysToEnter.push(key);
      }
      /** ORIGINAL
      if (nextChildMapping[key] && !hasPrev &&
        !this.currentlyTransitioningKeys[key]) {
        this.keysToEnter.push(key);
      }
       **/
    }

    for (let key in prevChildMapping) {
      let hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
      if (prevChildMapping[key] && !hasNext) {
        this.keysToLeave.push(key);

        let elem = findDOMNode(this.childRefs[key]);
        const rect = elem.getBoundingClientRect();
        console.log('rect = ', rect);
        const scrollTop = window.scrollY;
        // let styles = `position: fixed; z-index: 500; top: ${rect.top - scrollTop}px; width: ${rect.width}px;`;
        let styles = `position: fixed; z-index: -1; top: ${rect.top}px; width: ${rect.width}px;`;
        elem.style.cssText = styles;
        window.scrollTo(0,0);
      }
      /** ORIGINAL
      if (prevChildMapping[key] && !hasNext &&
        !this.currentlyTransitioningKeys[key]) {
        this.keysToLeave.push(key);
      }
       **/
    }

    /** MY ADDITION **/
    if (this.props.transitionMode === 'out-in') {
      this.keysToEnter = _.difference(this.keysToEnter, this.keysToLeave);
    }

    // If we want to someday check for reordering, we could do it here.
  }

  componentDidUpdate() {
    let keysToEnter = this.keysToEnter;
    let keysToLeave = this.keysToLeave;

    switch (this.props.transitionMode) {
      case 'out-in':
        this.keysToLeave = [];
        if (keysToLeave.length) {
          keysToLeave.forEach(this.performLeave)
        } else {
          this.keysToEnter = [];
          keysToEnter.forEach(this.performEnter)
        }
        break;
      case 'in-out':
        this.keysToEnter = [];
        this.keysToLeave = [];

        if (keysToEnter.length) {
          Promise.all(keysToEnter.map(this.performEnter))
            .then(function () {
              keysToLeave.forEach(this.performLeave)
            }.bind(this))
        } else {
          keysToLeave.forEach(this.performLeave)
        }
        break;
      case 'simultaneous':
      default:
        this.keysToEnter = [];
        this.keysToLeave = [];
        keysToEnter.forEach(this.performEnter);
        keysToLeave.forEach(this.performLeave);
        break;
    }
    /** Not used because it is handled by the above SWITCH
    keysToEnter.forEach(this.performEnter);
    keysToLeave.forEach(this.performLeave);
     **/
  }

  performAppear = (key) => {
    //this.currentlyTransitioningKeys[key] = true;
    this.currentlyEnteringOrEnteredKeys[key] = true;

    let component = this.childRefs[key];

    if (component.componentWillAppear) {
      component.componentWillAppear(
        this._handleDoneAppearing.bind(this, key),
      );
    } else {
      this._handleDoneAppearing(key);
    }
  };

  _handleDoneAppearing = (key) => {
    let component = this.childRefs[key];
    if (component && component.componentDidAppear) {
      component.componentDidAppear();
    }

    // delete this.currentlyTransitioningKeys[key];

    let currentChildMapping = getChildMapping(this.props.children);

    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully appeared. Remove it.
      this.performLeave(key);
    }
  };

  performEnter = (key) => {
    // this.currentlyTransitioningKeys[key] = true;
    if (this.currentlyEnteringKeys[key]) {
      return this.currentlyEnteringPromises[key];
    }

    this.cancelPendingLeave(key);

    let component = this.childRefs[key];

    if (!component) {
      return Promise.resolve();
    }

    this.currentlyEnteringOrEnteredKeys[key] = true;
    this.currentlyEnteringKeys[key] = true;

    const callback = this._handleDoneEntering.bind(this, key);
    this.pendingEnterCallbacks[key] = callback;

    const enterPromise = new Promise((resolve) => {
      if (component.componentWillEnter) {
        component.componentWillEnter(resolve);
      } else {
        resolve();
      }
    }).then(callback);

    this.currentlyEnteringPromises[key] = enterPromise;
    return enterPromise;

    /** Original

    if (component.componentWillEnter) {
      component.componentWillEnter(
        this._handleDoneEntering.bind(this, key),
      );
    } else {
      this._handleDoneEntering(key);
    }
     **/
  };

  _handleDoneEntering = (key) => {
    delete this.pendingEnterCallbacks[key];
    delete this.currentlyEnteringPromises[key];
    delete this.currentlyEnteringKeys[key];

    this.deferredLeaveRemovalCallbacks.forEach((fn) => { fn(); });
    this.deferredLeaveRemovalCallbacks = [];

    let component = this.childRefs[key];
    if (component && component.componentDidEnter) {
      component.componentDidEnter();
    }

    // delete this.currentlyTransitioningKeys[key];

    let currentChildMapping = getChildMapping(this.props.children);

    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key) && this.currentlyEnteringOrEnteredKeys[key]) {
      // This was removed before it had fully entered. Remove it.

      if (this.props.transitionMode !== 'in-out') {
        this.performLeave(key);
      }
    }


    /** ORIGINAL
    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully entered. Remove it.
      this.performLeave(key);
    }
     **/
  };

  performLeave = (key) => {
    // this.currentlyTransitioningKeys[key] = true;
    if (this.currentlyLeavingKeys[key]) {
      // let it finish leaving
      return this.currentlyLeavingPromises[key];
    }

    this.cancelPendingEnter(key);

    let component = this.childRefs[key];
    if (!component) {
      return Promise.resolve();
    }

    this.currentlyLeavingKeys[key] = true;

    const callback = this._handleDoneLeaving.bind(this, key);
    this.pendingLeaveCallbacks[key] = callback;

    const leavePromise = new Promise((resolve) => {
      if (component.componentWillLeave) {
        component.componentWillLeave(resolve);
      } else {
        resolve();
      }
    }).then(callback); // This can be dangerous because it calls setState() again, mutating the component before work is done

    this.currentlyLeavingPromises[key] = leavePromise;
    return leavePromise;

    /** ORIGINAL
    if (component && component.componentWillLeave) {
      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
    } else {
      // Note that this is somewhat dangerous b/c it calls setState()
      // again, effectively mutating the component before all the work
      // is done.
      this._handleDoneLeaving(key);
    }
     **/
  };

  _handleDoneLeaving = (key) => {
    delete this.pendingLeaveCallbacks[key];
    delete this.currentlyLeavingKeys[key];
    delete this.currentlyLeavingPromises[key];

    let component = this.childRefs[key];

    if (component && component.componentDidLeave) {
      component.componentDidLeave();
    }

    // delete this.currentlyTransitioningKeys[key];

    let currentChildMapping = getChildMapping(this.props.children);

    let updateChildren = function updateChildren () {
      this.setState((state) => {
        let newChildren = Object.assign({}, state.children);
        delete newChildren[key];
        return {children: newChildren};
      });
    }.bind(this);

    if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
      // This entered again before it fully left. Add it again.
      // but only do the enter if currently animating out, not already animated out
      if (this.props.transitionMode !== 'in-out') {
        this.performEnter(key);
      }
    } else {
      delete this.currentlyEnteringOrEnteredKeys[key];

      if (this.props.deferLeavingComponentRemoval && this.props.transitionMode !== 'in-out') {
        this.deferredLeaveRemovalCallbacks.push(updateChildren);
        this.forceUpdate();
      } else {
        updateChildren();
      }

      /** Original
      this.setState((state) => {
        let newChildren = Object.assign({}, state.children);
        delete newChildren[key];
        return { children: newChildren };
      });
       **/
    }
  };

  cancelPendingLeave (key) {
    if (this.pendingLeaveCallbacks[key]) {
      this.pendingLeaveCallbacks[key]();
      delete this.pendingLeaveCallbacks[key];
    }
  };

  cancelPendingEnter (key) {
    if (this.pendingEnterCallbacks[key]) {
      this.pendingEnterCallbacks[key]();
      delete this.pendingEnterCallbacks[key];
    }
  };

  render() {
    // could get rid of the need for the wrapper node
    // by cloning a single child
    let childrenToRender = [];
    for (let key in this.state.children) {
      let child = this.state.children[key];
      if (child) {
        let isCallbackRef = typeof child.ref !== 'string';
        let factoryChild = this.props.childFactory(child);
        let ref = (r) => {
          this.childRefs[key] = r;
        };

        /**
        warning(isCallbackRef,
          'string refs are not supported on children of TransitionGroup and will be ignored. ' +
          'Please use a callback ref instead: https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute');
         **/

        // Always chaining the refs leads to problems when the childFactory
        // wraps the child. The child ref callback gets called twice with the
        // wrapper and the child. So we only need to chain the ref if the
        // factoryChild is not different from child.
        if (factoryChild === child && isCallbackRef) {
          ref = chain(child.ref, ref);
        }

        // You may need to apply reactive updates to a child as it is leaving.
        // The normal React way to do it won't work since the child will have
        // already been removed. In case you need this behavior you can provide
        // a childFactory function to wrap every child, even the ones that are
        // leaving.
        childrenToRender.push(React.cloneElement(
          factoryChild,
          {
            key,
            ref,
            willLeave: this.keysToLeave.indexOf(key) > -1 ? true : false,
            elemRect: this.elemRect[key],
          },
        ));
      }
    }

    // Do not forward TransitionGroup props to primitive DOM nodes
    let props = Object.assign({}, this.props);
    delete props.transitionLeave;
    delete props.transitionName;
    delete props.transitionAppear;
    delete props.transitionEnter;
    delete props.childFactory;
    delete props.transitionLeaveTimeout;
    delete props.transitionEnterTimeout;
    delete props.transitionAppearTimeout;
    delete props.component;
    delete props.deferLeavingComponentRemoval;

    delete props.transitionMode;
    delete props.childRefId;

    return React.createElement(
      this.props.component,
      props,
      childrenToRender,
    );
  }
}

TransitionGroupCustom.propTypes = {
  component: PropTypes.any,
  childFactory: PropTypes.func,
  children: PropTypes.node,
  transitionMode: PropTypes.oneOf(['in-out', 'out-in', 'simultaneous']),
  deferLeavingComponentRemoval: PropTypes.bool,
};
TransitionGroupCustom.defaultProps = {
  component: 'span',
  childFactory: child => child,
  transitionMode: 'simultaneous',
  deferLeavingComponentRemoval: false,
};

function mapStateToProps(store, ownProps) {
  return {

  };
}

function mapDispatchToProps(dispatch, state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TransitionGroupCustom);
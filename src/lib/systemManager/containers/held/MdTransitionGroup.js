/**
 * This is a custom implementation of TransitionGroup (github: https://github.com/reactjs/react-transition-group)
 * and React Transition Group Plus (github: https://github.com/cheapsteak/react-transition-group-plus)
 * License MIT, React license under BSD
 */
/* eslint-disable */
import { chain } from '../../../utils/ChainFunction';
import React from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import { actionTypes } from '../actions/actionTypes';
import { transitionTypes } from '../actions/transitionTypes';
import Rx from 'rxjs/Rx';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MdTransitionGroupChild from '../components/MdTransitionGroupChild';
import { getChildMapping, mergeChildMappings } from '../utils/ChildMapping';
import { groupActions } from '../actions/transitionActions';

export const MdTransitionHandler = ({lifecycleManager, name, ...props}) => {
  return (<div {...props}>{props.children}</div>);
};

MdTransitionHandler.propTypes = {
  lifecycleManager: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
}
MdTransitionHandler.defaultProps = {
  //lifecycleManager: () => {},
  name: 'main',
}


class MdTransitionGroup extends React.Component {
  static displayName = 'MdTransitionGroup';

  constructor(props, context) {
    super(props, context);

    this.childRefs = Object.create(null);
    this.childContainers = Object.create(null);

    this.state = {
      children: getChildMapping(props.children),
    };
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    this.dispatch = this.context.mdTransitionDispatch;
    this.id = this.dispatch({
      type: actionTypes.CONNECT_COMPONENT,
      payload: {
        type: 'group',
        parentId: this.parentId,
        receiveDispatch: this.receiveDispatch,
        name: this.props.name
      }
    });
    this.registerChild = this.registerChild.bind(this);
    this.registerChildContainer = this.registerChildContainer.bind(this);
  }

  componentWillUnmount() {
    this.dispatch({
      type: actionTypes.DISCONNECT_COMPONENT,
      payload: {
        id: this.id,
      }
    });
  }

  receiveDispatch(action) {

  }

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
    }
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
      this.keysToEnter = difference(this.keysToEnter, this.keysToLeave);
    }
    // If we want to someday check for reordering, we could do it here.
  }

  componentWillUpdate() {
    const keysToLeaveLength = this.keysToLeave.length;
    if (this.keysToEnter.length > 0 || keysToLeaveLength) {
      let idsToLeave = [];
      for(let i = 0; i < keysToLeaveLength; i++) {
        idsToLeave.push(this.childRefs[this.keysToLeave[i]].getId());
      }

      this.dispatch({
        type: actionTypes.GROUP_WILL_UPDATE,
        payload: {
          id: this.id,
          idsToLeave: idsToLeave,
          handleUpdate: this.handleUpdate,
          transitionType: this.props.transitionType,
        }
      });

    }
  }

  handleUpdate(transData, scrollData) {
    let newState = {};
    switch(this.props.transitionType) {
      case transitionTypes.ANCHOR_COMMON_ELEMENT:
        break;
      case transitionTypes.ANCHOR_ONLY:
        break;
    }

    return Rx.Observable.create((observer) => {
      observer.next('HANDLING UPDATE OBSERVALBE ' + this.props.name);
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
      observer.complete();
    });
  }

  componentDidUpdate() {
    this.dispatch({
      type: actionTypes.GROUP_DID_UPDATE,
      payload: {
        id: this.id,
      }
    });

    /** Not used because it is handled by the above SWITCH
     keysToEnter.forEach(this.performEnter);
     keysToLeave.forEach(this.performLeave);
     **/
  }

  componentWillUnmount() {
    // this.subscription.unsubscribe();
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
        component.componentWillEnter(resolve, this.childContainers[key]);
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

  childFactory(child, key) {
    let ref = (r) => {
      this.childRefs[key] = r;
    };


    return(
     <MdTransitionGroupChild ref={ref} childRefId={this.props.childRefId} key={key} willLeave={this.keysToLeave.indexOf(key) > -1 ? true : false}>
      {child}
     </MdTransitionGroupChild>
    );
    return (
      React.createElement(
        MdTransitionGroupChild,
        {
          name: this.props.transitionName,
          appear: this.props.transitionAppear,
          enter: this.props.transitionEnter,
          leave: this.props.transitionLeave,
          appearTimeout: this.props.transitionAppearTimeout,
          enterTimeout: this.props.transitionEnterTimeout,
          leaveTimeout: this.props.transitionLeaveTimeout,
          childRefId: this.props.childRefId,
          transitionMode: this.props.transitionMode,
          // key,
          // ref,
          willLeave: this.keysToLeave.indexOf(key) > -1 ? true : false,
        },
        child,
      )
    );

  }

  registerChild(key, ref) {
    if (ref) {
      this.childRefs[key] = ref;
    }
  }

  registerChildContainer(key, elem) {
    if (elem) {
      this.childContainers[key] = elem;
    }
  }

  render() {
    let childrenToRender = [];
    let count = 0;
    for (let key in this.state.children) {
      let child = this.state.children[key].child;
      if (child) {

        let ref = (r) => {
          this.registerChild(key, r);
        };
        let props = {
          // registerChildContainer: this.registerChildContainer,
          // childKey: key,
          ref,
          // key: key,
          childRefId: this.props.childRefId,
          lifecycleManager: this.state.children[key].lifecycleManager,
          name: this.state.children[key].name,
          willLeave: this.keysToLeave.indexOf(key) > -1 ? true : false,
          willEnter: this.keysToEnter.indexOf(key) > -1 ? true : false,
        };
        if (props.willLeave) {
          let childRect = this.childContainers[key].getBoundingClientRect();
          let styles = {position: 'fixed', transformOrigin: '0% 0%', zIndex: 10, top: `${childRect.top}px`, width: `${childRect.width}px`};
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={styles}>
              <MdTransitionGroupChild {...props}>
                {child}
              </MdTransitionGroupChild>
            </div>
          );
        } else {

          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={{overflow: 'hidden'}}>
              <MdTransitionGroupChild {...props}>
                  {child}
              </MdTransitionGroupChild>
            </div>
          );
        }

        count++;


        /**
        childrenToRender.push(
          <MdTransitionGroupChild {...props}>
            <div key={key} ref={elem => this.registerElem(key, elem)}>
              {child}
            </div>
          </MdTransitionGroupChild>
        );
         **/
        /**
        childrenToRender.push(
          <div ref={ref} key={key}>
            <MdTransitionGroupChild {...props}>
              {child}
            </MdTransitionGroupChild>
          </div>
        );
         **/

      }
    }
    /**
    if (this.anchorElem) {
      childrenToRender.push(
        <div key="241" style={{top: 0, zIndex: '1', position: 'absolute', width: '500px', height: '500px'}}>
          {this.anchorElem.callback('render')}
        </div>
      );
      this.anchorElem = null;
    }
     **/

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

    return(
      <div>
        {childrenToRender}
      </div>
    );
    /**
    return React.createElement(
      this.props.component,
      props,
      childrenToRender,
    );
     **/

  }
}

MdTransitionGroup.propTypes = {
  component: PropTypes.any,
  childFactory: PropTypes.func,
  children: PropTypes.node,
  transitionMode: PropTypes.oneOf(['in-out', 'out-in', 'simultaneous']),
  deferLeavingComponentRemoval: PropTypes.bool,
};
MdTransitionGroup.defaultProps = {
  component: 'span',
  childFactory: child => child,
  transitionMode: 'in-out',
  deferLeavingComponentRemoval: false,
};

MdTransitionGroup.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
}
MdTransitionGroup.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}

function mapStateToProps(store, ownProps) {
  return {

  };
}

function mapDispatchToProps(dispatch, state) {
  return {
    dispatch,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MdTransitionGroup));
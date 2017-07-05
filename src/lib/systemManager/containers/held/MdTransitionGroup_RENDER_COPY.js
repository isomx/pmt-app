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
    this.nonce = this.getNonce();
    this.state = {
      children: getChildMapping(props.children),
      nonce: this.nonce,
    };
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
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
    }
    this.registerChild = this.registerChild.bind(this);
    this.registerChildContainer = this.registerChildContainer.bind(this);
    this.childIdToKey = {};
  }

  getNonce() {
    let text = [];
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return text.join('');
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
        //this.performAppear(key);
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
    }
    for (let key in prevChildMapping) {
      let hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
      if (prevChildMapping[key] && !hasNext) {
        this.keysToLeave.push(key);
      }
    }

    /** MY ADDITION **/
    if (this.props.transitionMode === 'out-in') {
      this.keysToEnter = difference(this.keysToEnter, this.keysToLeave);
    }
    // If we want to someday check for reordering, we could do it here.
  }

  componentWillUpdate() {
    console.log('MdTransitionGroup ' + this.props.name + ' WillUpdate');
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
          handleUpdate: this.handleUpdate(),
          transitionType: this.props.transitionType,
        }
      });

    }
  }

  handleUpdate(transData) {
    const setState = (updatedChildren, callback) => {
      this.setState({children: updatedChildren}, callback);
    };
    return Rx.Observable.create((observer) => {
      observer.next('HANDLING UPDATE OBSERVALBE ' + this.props.name);
      let keysToEnter = this.keysToEnter;
      let keysToLeave = this.keysToLeave;
      let currChildren = {...this.state.children};
      for (let i in keysToLeave) {
        delete currChildren[keysToLeave[i]];
      }
      setTimeout(() => {
        setState(currChildren, observer.complete);
      }, 5600000);
    });
    /**
    let newState = {};
    if (this.props.transitionType === transitionTypes.ANCHOR_COMMON_ELEMENT || this.props.transitionType === transitionTypes.ANCHOR_ONLY) {
      // you can safely assume it's all here. The checks are performed at the top.
      console.log('MdTransitionGroup transData = ', transData);
      if (this.childIdToKey[transData.childId]) {
        const childKey = this.childIdToKey[transData.childId];
        let reverse = false, toAnchor, fromAnchor, toCommon, fromCommon, newBodyElems, toAnchorRender$;
        toAnchor = transData.toAnchor.data;
        fromAnchor = transData.fromAnchor.data;
        toCommon = transData.toCommonElement.data;
        fromCommon = transData.fromCommonElement.data;
        console.log('toAnchor = ', toAnchor);
        console.log('fromAnchor = ', fromAnchor);
        console.log('toCommon = ', toCommon);
        console.log('fromCommon = ', fromCommon);
        if (transData.toAnchor.data.rect.width + transData.toAnchor.data.rect.height < transData.fromAnchor.data.rect.width + transData.fromAnchor.data.rect.height) {
          reverse = true;
        }
        newBodyElems = [
          {
            style: {
              position: 'absolute',
              top: `${fromCommon.rect.top}px`,
              left: `${fromCommon.rect.left}px`,
              height: `${fromCommon.rect.height}px`,
              width: `${fromCommon.rect.width}px`,
              zIndex: 10,
            },
            children: toCommon.children,
          }
        ];
        const addBodyElemResp = transData.addBodyElements(newBodyElems);
        const bodyElementIds = addBodyElemResp.ids;
        const addBodyElements$ = addBodyElemResp.add$;
        console.log('bodyElementIds = ', bodyElementIds);
        console.log('addBodyElements$ = ', addBodyElements$);
        toAnchorRender$ = toAnchor.prepareRender(
          {
            position: 'absolute',
            top: `${0}px`,
            left: `${0}px`,
            height: `${toAnchor.rect.height}px`,
            width: `${toAnchor.rect.width}px`,
            zIndex: 10,
            visibility: 'visible',
          },
          {
            overflow: 'hidden',
            position: 'absolute',
            top: `${fromAnchor.rect.top}px`,
            left: `${fromAnchor.rect.left}px`,
            height: `${fromAnchor.rect.height}px`,
            width: `${fromAnchor.rect.width}px`,
            zIndex: 10,
            visibility: 'visible',
          });
        const renderStream$ = Rx.Observable.merge(toAnchorRender$, addBodyElements$);
        renderStream$.subscribe(
          (val) => {console.log('renderStream$ val = ', val);},
          (err) => {console.log('renderStream$ err = ', err);},
          () => {console.log('renderStream$ complete')},
        );


      }

    }


    return Rx.Observable.create((observer) => {
      observer.next('HANDLING UPDATE OBSERVALBE ' + this.props.name);
      let keysToEnter = this.keysToEnter;
      let keysToLeave = this.keysToLeave;
      setTimeout(() => {
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
      }, 5600000);
    });
     **/
  }

  componentDidUpdate() {
    console.log('GROUP ' + this.props.name + ' DID UPDATE');
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
    console.log('mdTransitionGroup Will Unmount');
  }

  registerChild(key, ref) {
    if (ref) {
      this.childRefs[key] = ref;
      this.childIdToKey[ref.getId()] = key;
      console.log('this.childIdToKey = ', this.childIdToKey);
    }
  }

  registerChildContainer(key, elem) {
    if (elem) {
      this.childContainers[key] = elem;
    }
  }

  render() {
    console.log('mdTransitionGroup rendering');
    let childrenToRender = [];
    let count = 0;
    for (let key in this.state.children) {
      let child = this.state.children[key].child;
      if (child) {

        let ref = (r) => {
          this.registerChild(key, r);
        };
        let props = {
          registerChildContainer: this.registerChildContainer,
          // childKey: key,
          ref,
          // key: key,
          name: this.state.children[key].name,
          willLeave: this.keysToLeave.indexOf(key) > -1 ? true : false,
          update: this.state.nonce !== this.nonce ? false : true,
          willEnter: this.keysToEnter.indexOf(key) > -1 ? true : false,
        };
        if (props.willLeave) {
          let childRect = this.childContainers[key].getBoundingClientRect();
          let styles = {position: 'fixed', zIndex: -1, top: `${childRect.top}px`, width: `${childRect.width}px`};
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={styles}>
              <MdTransitionGroupChild {...props}>
                {child}
              </MdTransitionGroupChild>
            </div>
          );
        } else if (props.willEnter) {
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={{visibility: 'visible'}}>
              <MdTransitionGroupChild {...props}>
                  {child}
              </MdTransitionGroupChild>
            </div>
          );
        } else {
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={{visibility: 'visible'}}>
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
    // document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.nonce = this.state.nonce;
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
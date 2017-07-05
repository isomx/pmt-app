import React from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../../actions/actionTypes';
import Rx from 'rxjs/Rx';
import MdTransitionGroupChild from './MdTransitionGroupChild';
import { getChildMapping, mergeChildMappings } from '../../utils/ChildMapping';


export default class MdTransitionGroup extends React.Component {
  static displayName = 'MdTransitionGroup';

  constructor(props, context) {
    super(props, context);
    this.childIdToKey = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.childRefs = {};
    this.childContainers = {};
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.registerChild = this.registerChild.bind(this);
    this.registerChildContainer = this.registerChildContainer.bind(this);
    this.setState = this.setState.bind(this);

    this.state = {
      children: getChildMapping(props.children),
    };
    let initialChildMapping = this.state.children;
    for (let key in initialChildMapping) {
      if (initialChildMapping.hasOwnProperty(key) && initialChildMapping[key]) {
        this.keysToEnter.push(key);
      }
    }
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
      if (this.keysToEnter.length > 0) {
        this.dispatch({
          type: actionTypes.GROUP_WILL_UPDATE,
          payload: {
            id: this.id,
          }
        });
      }
    }
  }

  receiveDispatch(action) {
    switch (action.type) {
      case actionTypes.GROUP_GET_CHILD_REF:
        let childKey = this.childIdToKey[action.payload.groupChildId];
        if (childKey) {
          return this.childContainers[childKey];
        }
        return null;
      default:

    }
  }

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
    }
  }

  componentDidMount() {
    let initialChildMapping = this.state.children;
    let id, idsToAppear = [];
    for (let key in initialChildMapping) {
      if (initialChildMapping.hasOwnProperty(key) && initialChildMapping[key]) {
        id = this.childRefs[key] ? this.childRefs[key].getId() : null;
        if (id) idsToAppear.push(id);
      }
    }
    if ((idsToAppear.length > 0) && this.dispatch) {
      this.dispatch({
        type: actionTypes.GROUP_DID_UPDATE,
        payload: {
          id: this.id,
          idsToLeave: [],
          idsToEnter: [],
          idsToAppear,
          handleUpdate: this.handleUpdate(),
          transitionType: this.props.transitionType,
        }
      });
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
      if (nextChildMapping.hasOwnProperty(key)) {
        let hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
        if (nextChildMapping[key] && !hasPrev) {
          this.keysToEnter.push(key);
        }
      }
    }
    for (let key in prevChildMapping) {
      if (prevChildMapping.hasOwnProperty(key)) {
        let hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
        if (prevChildMapping[key] && !hasNext) {
          this.keysToLeave.push(key);
        }
      }
    }
  }

  componentWillUpdate() {
    if ((this.keysToEnter.length > 0 || this.keysToLeave.length > 0) && this.dispatch) {
      this.dispatch({
        type: actionTypes.GROUP_WILL_UPDATE,
        payload: {
          id: this.id,
        }
      });
    }
  }

  componentDidUpdate() {
    const keysToLeaveLength = this.keysToLeave.length;
    const keysToEnterLength = this.keysToEnter.length;
    let idsToLeave = [], idsToEnter = [], id;
    if (keysToLeaveLength > 0) {
      for (let i = 0; i < keysToLeaveLength; i++) {
        id = this.childRefs[this.keysToLeave[i]] ? this.childRefs[this.keysToLeave[i]].getId() : null;
        if (id) idsToLeave.push(id);
      }
    }
    if (keysToEnterLength > 0) {
      for (let i = 0; i < keysToEnterLength; i++) {
        id = this.childRefs[this.keysToEnter[i]] ? this.childRefs[this.keysToEnter[i]].getId() : null;
        if (id) idsToEnter.push(id);
      }
    }
    if ((idsToLeave.length > 0 || idsToEnter.length > 0) && this.dispatch) {
      this.dispatch({
        type: actionTypes.GROUP_DID_UPDATE,
        payload: {
          id: this.id,
          idsToLeave: idsToLeave,
          idsToEnter: idsToEnter,
          idsToAppear: [],
          handleUpdate: this.handleUpdate(),
          transitionType: this.props.transitionType,
        }
      });
    }
  }

  handleUpdate() {
    return Rx.Observable.create((observer) => {
      let keysToLeave = this.keysToLeave;
      //let keysToEnter = this.keysToEnter;
      this.keysToEnter = [];
      this.keysToLeave = [];
      let currChildren = {...this.state.children};
      for (let i in keysToLeave) {
        if (keysToLeave[i] || keysToLeave[i] === 0) {
          delete currChildren[keysToLeave[i]];
        }
      }
      this.setState({children: currChildren}, () => {
        /**
        console.log('this.childContainers = ', this.childContainers);
        console.log('this.state.children = ', this.state.children);
        for(let key in this.childContainers) {
          if (this.childContainers.hasOwnProperty(key)) {
            console.log('rect for key ' + key + ' = ', this.childContainers[key].getBoundingClientRect());
            console.log('computedStyles = ', window.getComputedStyle(this.childContainers[key]));

          }
        }
         **/
        observer.complete()
      });
    });
  }

  componentWillUnmount() {
    if (this.id) {
      this.dispatch({
        type: actionTypes.DISCONNECT_COMPONENT,
        payload: {
          id: this.id,
        }
      });
    }
  }

  registerChild(key, ref) {
    if (ref) {
      this.childRefs[key] = ref;
      this.childIdToKey[ref.getId()] = key;
    }
  }

  registerChildContainer(key, elem) {
    if (elem) {
      this.childContainers[key] = elem;
    }
  }

  render() {
    let childrenToRender = [];

    for (let key in this.state.children) {
      if (!this.state.children.hasOwnProperty(key)) continue;
      let child = this.state.children[key].child;
      if (child) {

        let ref = (r) => {
          this.registerChild(key, r);
        };
        let props = {
          ref,
          name: this.state.children[key].name,
        };
        if (this.keysToLeave.indexOf(key) > -1) {
          let childRect = this.childContainers[key].getBoundingClientRect();
          let styles = {position: 'fixed', zIndex: 1, top: `${childRect.top}px`, width: `${childRect.width}px`};
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={styles}>
              <MdTransitionGroupChild update={false} {...props}>
                {child}
              </MdTransitionGroupChild>
            </div>
          );
        } else if (this.keysToEnter.indexOf(key) > -1) {
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)} style={{opacity: 0}}>
              <MdTransitionGroupChild update={true} {...props}>
                  {child}
              </MdTransitionGroupChild>
            </div>
          );
        } else {
          childrenToRender.push(
            <div key={key} ref={(elem) => this.registerChildContainer(key, elem)}>
              <MdTransitionGroupChild update={true} {...props}>
                {child}
              </MdTransitionGroupChild>
            </div>
          );
        }

      }
    }
    return(
      <div>
        {childrenToRender}
      </div>
    );
  }
}

MdTransitionGroup.propTypes = {
  name: PropTypes.string.isRequired,
  transitionType: PropTypes.string.isRequired,
};

MdTransitionGroup.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
}
MdTransitionGroup.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}
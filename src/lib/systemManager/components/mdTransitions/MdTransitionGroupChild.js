import React from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../../actions/actionTypes';

export default class MdTransitionGroupChild extends React.Component {
  static displayName = 'MdTransitionGroupChild';

  constructor(props, context) {
    super(props, context);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
      this.dispatch = this.context.mdTransitionDispatch;
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'groupChild',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: this.props.name,
        }
      });
    }
  }

  getId() {
    return this.id;
  }

  receiveDispatch(action) {

  }

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
    }
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

  componentWillReceiveProps(nextProps) {
    this.update = nextProps.update;
  }

  shouldComponentUpdate(nextProps) {
    return this.update;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

MdTransitionGroupChild.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}
MdTransitionGroupChild.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}

MdTransitionGroupChild.propTypes = {
  name: PropTypes.any,
  update: PropTypes.bool,
};

import React from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../../actions/actionTypes';

export default class MdTransitionEvent extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
      this.dispatch = this.context.mdTransitionDispatch;
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'event',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: this.props.name,
        }
      });
    }
    this.recordPosition = this.recordPosition.bind(this);
  }

  componentWillUnmount() {
    if (this.dispatch) {
      this.dispatch({
        type: actionTypes.DISCONNECT_COMPONENT,
        payload: {
          id: this.id,
        }
      });
    }
  }

  receiveDispatch(action) {

  }

  recordPosition() {
    if (this.id) {
      this.dispatch({
        type: actionTypes.EVENT_RECORD_POSITION,
        payload: {
          id: this.id,
        }
      });
    }
  }

  render() {
    return this.props.render({
      recordPosition: this.recordPosition,
    });
  }
}

MdTransitionEvent.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
}

MdTransitionEvent.propTypes = {
  name: PropTypes.any.isRequired,
  render: PropTypes.func.isRequired,
}

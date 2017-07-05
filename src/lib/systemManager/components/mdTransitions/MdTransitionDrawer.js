/* eslint-disable */
import React, { PureComponent } from 'react';
import Drawer from 'react-md/lib/Drawers';
import PropTypes from 'prop-types';
import { actionTypes } from '../../actions/actionTypes';
// import Button from 'react-md/lib/Buttons';
// import cn from 'classnames';
// import Home from '../containers/funnels/Home';

export default class MdTransitionDrawer extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
      this.dispatch = this.context.mdTransitionDispatch;
      if (this.context.sysZoomPanMgrParentId) {
        this.zoomPanId = this.context.sysZoomPanMgrParentId;
      }
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'sysMgrDrawer',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: 'sysMgr',
          zoomPanId: this.zoomPanId ? this.zoomPanId : null,
        }
      });
    }
    const container = document.createElement('div');
    container.setAttribute('id', 'mdDrawer_' + this.id);
    container.setAttribute('style', 'top: 0px; position: fixed; height: 100%');
    this.container = document.body.appendChild(container);
  }

  componentWillUnmount() {
    if (this.container) {
      document.body.removeChild(this.container);
    }
  }

  receiveDispatch(action) {
    switch(action.type) {
      case actionTypes.DRAWER_GET_ELEM:
        return this.container;
      default:
    }

  }

  render() {
    return(
      <Drawer {...this.props} renderNode={this.container} />
    );
  }
}

MdTransitionDrawer.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
  sysZoomPanMgrParentId: PropTypes.string,
}
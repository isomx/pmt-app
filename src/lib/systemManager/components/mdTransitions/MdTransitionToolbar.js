/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../../actions/actionTypes';
// import Button from 'react-md/lib/Buttons';
// import cn from 'classnames';
// import Home from '../containers/funnels/Home';

export default class MdTransitionToolbar extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.registerRef = this.registerRef.bind(this);
    this.parentId = this.context.mdTransitionParentId;
    if (this.parentId) {
      this.dispatch = this.context.mdTransitionDispatch;
      if (this.context.sysZoomPanMgrParentId) {
        this.zoomPanId = this.context.sysZoomPanMgrParentId;
      }
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'sysMgrToolbar',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: 'sysMgr',
          zoomPanId: this.zoomPanId ? this.zoomPanId : null,
        }
      });
    }
    this.findById = this.props.findById ? this.props.findById : false;

  }

  receiveDispatch(action) {
    switch(action.type) {
      case actionTypes.TOOLBAR_GET_ELEM:
        if (this.findById) {
          return document.getElementById(this.findById);
        }
        return this.ref;
      default:

    }
  }

  registerRef(ref) {
    if (ref) {
      this.ref = ref;
    }
  }


  render() {
    const { className, children } = this.props;
    if (className.indexOf('md-tabs-container') > -1) {
      let render = [];
      let count = 0;
      React.Children.map(children, (thisArg) => {
        if (thisArg) {
          if (thisArg.props.className.indexOf('md-tabs-fixed-container') > -1) {
            render.push(React.cloneElement(thisArg, {id: 'mdToolbarTabs_' + this.id, key: count}, thisArg.props.children));
          } else {
            render.push(thisArg);
          }
        }
        count++;
      });
      this.findById = 'mdToolbarTabs_' + this.id;
      return (
        <header className={className}>
          {render}
        </header>
      );
    }
    return(
      <header {...this.props} ref={this.registerRef} />
    );
  }
}

MdTransitionToolbar.contextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
  sysZoomPanMgrParentId: PropTypes.string,
}
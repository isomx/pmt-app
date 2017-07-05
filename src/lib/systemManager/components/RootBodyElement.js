import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { actionTypes } from '../actions/actionTypes';

export default class RootBodyElement extends Component {
  constructor(props) {
    super(props);
    this.update = true;
    this.receiveDispatch = this.receiveDispatch.bind(this);
    if (this.props.id) {
      this.id = this.props.storeId;
      this.props.dispatch({
        type: actionTypes.BODY_ELEMENT_CONNECT,
        payload: {
          id: this.id,
          receiveDispatch: this.receiveDispatch,
        }
      });
    }
  }

  receiveDispatch(action) {

  }

  componentWillReceiveProps(nextProps) {
    this.update = nextProps.update;
  }

  shouldComponentUpdate() {
    return this.update;
  }

  render() {
    const { children, component, render, componentRef, ...rest } = this.props;
    if (render) {
      return render({id: this.id});
    } else {
      delete rest.update;
      delete rest.dispatch;
      delete rest.storeId;
      if (componentRef) {
        rest.ref = componentRef;
      }
      if (!component) {
        if (React.Children.count(children) > 1) {
          return(
            <div>
              {this.props.children}
            </div>
          );
        } else {
          return React.Children.only(children);
        }
      } else {
        return React.createElement(component, rest, children);
      }
    }
  }
}

RootBodyElement.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  update: PropTypes.bool.isRequired,
}
RootBodyElement.defaultProps = {
  component: null,
}
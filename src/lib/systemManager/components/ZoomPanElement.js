import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ZoomPanElement extends Component {
  constructor(props) {
    super(props);
    this.update = true;
  }

  componentWillReceiveProps(nextProps) {
    this.update = nextProps.update;
  }

  shouldComponentUpdate() {
    return this.update;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

ZoomPanElement.propTypes = {
  update: PropTypes.bool.isRequired,
}

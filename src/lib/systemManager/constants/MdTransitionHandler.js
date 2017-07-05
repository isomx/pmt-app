import React from 'react';
import PropTypes from 'prop-types';

export const MdTransitionHandler = (props) => {
  const {render, component, children, ...rest} = props;
  delete rest.name;
  if (render) {
    return render();
  } else if (component) {
    return React.createElement(component, rest, children);
  } else {
    return (<div {...rest}>{children}</div>);
  }
};

MdTransitionHandler.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.any,
  render: PropTypes.func,
}

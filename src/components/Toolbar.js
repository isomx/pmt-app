/* eslint-disable */
import React, { PureComponent } from 'react';
import MdToolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import cn from 'classnames';
// import Home from '../containers/funnels/Home';

export default class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    /**
    return (
      <MdToolbar
        fixed={this.props.fixed}
        colored={this.props.colored}
        title={this.props.title}
        nav={<Button key="nav" icon>{this.props.navIcon}</Button>}
        className={cn('md-divider-border md-divider-border--bottom')}
      />
    );
     **/
    return (
      <div className="md-toolbar-relative">
        <MdToolbar
          fixed={this.props.fixed}
          colored={this.props.colored}
          title={this.props.title}
          nav={<Button key="nav" icon>{this.props.navIcon}</Button>}
          className={cn('md-divider-border md-divider-border--bottom')}
          prominent
        />
      </div>
    );
  }
}

Toolbar.defaultProps = {
  fixed: true,
  colored: true,
  navIcon: 'menu',
  title: 'Predictive Marketing',
}
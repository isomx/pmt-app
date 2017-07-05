/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'react-md/lib/Drawers';
import Toolbar  from 'react-md/lib/Toolbars';
import cn from 'classnames';
import Button from 'react-md/lib/Buttons';


export default class NavDrawerMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
    }
    this.visibilityToggleCallback = this.visibilityToggleCallback.bind(this)
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.update = this.props.update;
  }

  componentWillReceiveProps(nextProps) {
    this.update = nextProps.update;
  }

  shouldComponentUpdate() {
    return this.update;
  }

  visibilityToggleCallback(visible) {
    this.update = true;
    this.setState({visible});
  }

  toggleVisibility() {
    this.update = true;
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const close = <Button icon onClick={this.toggleVisibility}>arrow_back</Button>
    const header = (
      <Toolbar
        //nav={close}
        actions={close}
        className="md-divider-border md-divider-border--bottom"
        prominent
      />
    );
    return (
      <Drawer
        {...this.state}
        position="left"
        navItems={this.props.navItems}
        navStyle={{paddingLeft: '10px'}}
        onVisibilityToggle={this.visibilityToggleCallback}
        type={Drawer.DrawerTypes.TEMPORARY}
        header={header}
        style={{zIndex: 18}}
        //clickableDesktopOverlay={false}
        />
    )
  }
}

NavDrawerMain.propTypes = {
  update: PropTypes.bool.isRequired,
  navItems: PropTypes.array.isRequired,
}
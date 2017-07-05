/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Drawer from 'react-md/lib/Drawers';
import FontIcon from 'react-md/lib/FontIcons';
import NavDrawerMain from '../components/NavDrawerMain';
import TreeContainer from './TreeContainer';
import cn from 'classnames';
import { connect } from 'react-redux';
import { MdTransitionDrawer, MdTransitionToolbar } from '../lib/systemManager';
import NavigationDrawer from './NavigationDrawer';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.registerNavDrawer.bind(this);
    this.toolbarNavClick = this.toolbarNavClick.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.visibilityToggleCallback = this.visibilityToggleCallback.bind(this);
  }

  toolbarNavClick(e) {
    this.navDrawer.toggleVisibility();
  }

  visibilityToggleCallback(visible) {
    this.update = true;
    this.setState({visible});
  }

  toggleVisibility() {
    this.update = true;
    this.setState({ visible: !this.state.visible });
  }

  registerNavDrawer(ref) {
    if (ref) {
      this.navDrawer = ref;
    }
  }

  render() {
    const navItems = [
      {
        primaryText: 'Apps',
        leftIcon: <FontIcon>arrow_forward</FontIcon>,
        //to: "/funnels",
        active: false,
      },
      {
        primaryText: 'Apps',
        component: Link,
        leftIcon: <FontIcon>apps</FontIcon>,
        to: "/funnels",
        active: true,
      },

    ];
    return (
      <NavigationDrawer>
        <section className="md-toolbar-relative">
          <MdTransitionDrawer
            visible={true}
            position="right"
            navItems={navItems}
            navStyle={{marginLeft: '10px', marginRight: '-10px'}}
            type={Drawer.DrawerTypes.PERSISTENT_MINI}
            style={{zIndex: 17, height: '400px'}}
            className="md-toolbar-relative md-paper--5"
            onVisibilityToggle={this.visibilityToggleCallback}
            //renderNode={document.getElementById('aside1')}
            //clickableDesktopOverlay={false}
          />
          <TreeContainer treeId="groupTree2" />
        </section>
      </NavigationDrawer>

    );

  }

}

function mapStateToProps(store, ownProps) {
  return {
    locationState: ownProps.location.state ? ownProps.location.state.mdTransition : null,
    location: ownProps.location,
  };
}

function mapDispatchToProps(dispatch, state) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree);

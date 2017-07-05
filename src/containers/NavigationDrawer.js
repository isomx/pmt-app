/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import getNavItems from '../constants/navItems';
import Drawer from 'react-md/lib/Drawers';
import FontIcon from 'react-md/lib/FontIcons';
import cn from 'classnames';
import NavDrawerMain from '../components/NavDrawerMain';
import { MdTransitionToolbar } from '../lib/systemManager'

class NavigationDrawer extends Component {
  constructor(props) {
    super(props);
    this.toolbarNavClick = this.toolbarNavClick.bind(this);
    this.registerNavDrawer = this.registerNavDrawer.bind(this);
  }

  toolbarNavClick(e) {
    this.navDrawer.toggleVisibility();
  }

  registerNavDrawer(ref) {
    if (ref) {
      this.navDrawer = ref;
    }
  }

  render() {
    const navItemsResp = getNavItems();
    let { prominent, bottomBorder, zDepth } = this.props;
    return(
      <div style={{lineHeight: '0px'}}>&nbsp;
        <Toolbar
          fixed={true}
          colored={true}
          title='Dashboard'
          nav={<Button key="nav" icon onClick={this.toolbarNavClick}>menu</Button>}
          className={cn({'md-divider-border': bottomBorder, 'md-divider-border--bottom': bottomBorder})}
          prominent={prominent}
          zDepth={zDepth}
          component={MdTransitionToolbar}
        />
        <NavDrawerMain navItems={navItemsResp.navItems} update={false} ref={(ref) => this.registerNavDrawer(ref)} />
        {this.props.children}
      </div>
    );

  }
}
NavigationDrawer.propTypes = {
  prominent: PropTypes.bool.isRequired,
  bottomBorder: PropTypes.bool.isRequired,
  zDepth: PropTypes.number.isRequired,
}
NavigationDrawer.defaultProps = {
  prominent: false,
  bottomBorder: true,
  zDepth: 2,
}


function mapStateToProps(store, ownProps) {
  return {

  };
}

function mapDispatchToProps(dispatch, state) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDrawer)
/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Drawer from 'react-md/lib/Drawers';
import FontIcon from 'react-md/lib/FontIcons';
import cn from 'classnames';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import { MdTransitionDrawer, MdTransitionToolbar } from '../lib/systemManager';
import NavigationDrawer from './NavigationDrawer';



import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, { MediaOverlay } from 'react-md/lib/Media';


import PropTypes from 'prop-types';
import NavDrawerMain from '../components/NavDrawerMain';

const imgSrc = 'http://freedomlifestylenetwork.com/app/img/screenshots/s_74_0.jpg';

class Funnels extends Component {
  constructor(props) {
    super(props);
    this.navDrawer = null;
    this.registerNavDrawer.bind(this);
    this.toolbarNavClick = this.toolbarNavClick.bind(this);
    this.visibilityToggleCallback = this.visibilityToggleCallback.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);

    this.handleTabChange = this.handleTabChange.bind(this);
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

  handleTabChange() {

  }

  render() {
    const navItems = [
      {
        primaryText: 'Apps',
        component: Link,
        leftIcon: <FontIcon>dashboard</FontIcon>,
        to: "/dashboard",
        active: false,
      },
      {
        primaryText: 'Apps',
        component: Link,
        leftIcon: <FontIcon>train</FontIcon>,
        to: "/funnels",
        active: true,
      },
      {divider: true},
      {
        primaryText: 'Apps',
        leftIcon: <FontIcon>arrow_forward</FontIcon>,
        //to: "/funnels",
        active: false,
      },

    ];
    const toolItems = [
      {
        primaryText: 'Zoom In',
        leftIcon: <FontIcon>zoom_in</FontIcon>,
        active: false,
      },
      {
        primaryText: 'Zoom Out',
        leftIcon: <FontIcon>zoom_out</FontIcon>,
        active: false,
      },

    ]

    /**

     <MdTransitionDrawer
     //visible={true}
     position="left"
     navItems={navItems}
     navStyle={{marginLeft: '10px', marginRight: '-10px'}}
     type={Drawer.DrawerTypes.PERSISTENT_MINI}
     style={{zIndex: 17}}
     className="md-toolbar-relative--prominent md-paper--5"
     //onVisibilityToggle={this.visibilityToggleCallback}
     //clickableDesktopOverlay={false}
     />

     */
    const mainToolbar = (<Toolbar colored={true} title='Funnels' nav={<Button icon onClick={this.toolbarNavClick}>menu</Button>} className="md-background--primary md-toolbar--text-white" />);
    return (
      <NavigationDrawer>
        <section className="md-toolbar-relative--prominent md-drawer-relative--mini md-grid md-grid--40-24">
          <TabsContainer onTabChange={this.handleTabChange} activeTabIndex={0} colored toolbar={mainToolbar} component={MdTransitionToolbar} fixed>
            <Tabs tabId="tab">
              <Tab label="Tab One">
                <h3 className="md-cell md-cell--12">Hello, World!</h3>
              </Tab>
              <Tab label="Tab Two">
                <div className="md-cell md-cell--12">
                  <div>HELLO WORLD!</div>
                </div>
              </Tab>
            </Tabs>
          </TabsContainer>
        </section>
      </NavigationDrawer>
    )
  }
}
/**

 <Drawer
 {...this.state}
 position="left"
 navItems={navItemsResp.navItems}
 navStyle={{paddingLeft: '10px'}}
 onVisibilityToggle={this.visibilityToggleCallback}
 type={Drawer.DrawerTypes.TEMPORARY}
 header={header}
 style={{zIndex: 500}}
 //clickableDesktopOverlay={false}
 />
 *
 */
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

export default connect(mapStateToProps, mapDispatchToProps)(Funnels)



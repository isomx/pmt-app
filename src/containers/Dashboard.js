/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Drawer from 'react-md/lib/Drawers';
import FontIcon from 'react-md/lib/FontIcons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import CSSTransitionGroup from 'react-addons-transition-group';
import cn from 'classnames';
import PropTypes from 'prop-types';

import NavigationDrawer from './NavigationDrawer';
import NavDrawerMain from '../components/NavDrawerMain';

import { MdTransitionDrawer, MdTransitionToolbar } from '../lib/systemManager'

const imgSrc = 'http://freedomlifestylenetwork.com/app/img/screenshots/s_74_0.jpg';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.navDrawer = null;
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
    /**
    const toolbarActions = (
      <TabsContainer onTabChange={this._handleTabChange} activeTabIndex={1} panelClassName="md-grid" colored>
        <Tabs tabId="tab">
          <Tab label="Tab One">
            <h3 className="md-cell md-cell--12">Hello, World!</h3>
          </Tab>
          <Tab label="Tab Two">
            <CSSTransitionGroup
              component="div"
              className="md-cell md-cell--12"
              transitionName="md-cross-fade"
              transitionEnterTimeout={300}
              transitionLeave={false}
            >
              <div>HELLO WORLD!</div>
            </CSSTransitionGroup>
          </Tab>
        </Tabs>
      </TabsContainer>
    )
     <MdTransitionDrawer
     visible={true}
     position="left"
     navItems={navItems}
     navStyle={{marginLeft: '10px', marginRight: '-10px'}}
     type={Drawer.DrawerTypes.PERSISTENT_MINI}
     style={{zIndex: 17}}
     className="md-toolbar-relative md-paper--5"
     onVisibilityToggle={this.visibilityToggleCallback}
     //renderNode={document.getElementById('aside1')}
     //clickableDesktopOverlay={false}
     />

     **/
    return (
      <NavigationDrawer>

        <section className="md-toolbar-relative md-drawer-relative--mini md-grid md-grid--40-24">
          <div className="md-cell md-cell--4">
            <Card className="md-block-centered" raise={true}>
              <Media>
                <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                <MediaOverlay>
                  <CardTitle title="mysiteasdfwejlk3sdfsdfsdfsdfsdf4.com">
                    <Button className="md-cell--right" icon>star_outline</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />

                  <Button flat label="Dashboard" />
              </CardActions>
              <CardText expandable></CardText>
            </Card>
          </div>
          <div className="md-cell md-cell--4">
            <Card className="md-block-centered" raise={true}>
                <Media>
                  <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                  <MediaOverlay>
                    <CardTitle title="mysiteasdfwejlk34.com">
                      <Button className="md-cell--right" icon>star_outline</Button>
                    </CardTitle>
                  </MediaOverlay>
                </Media>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
                  <Button flat label="Dashboard"/>
                } />
              </CardActions>
              <CardText expandable></CardText>
            </Card>
          </div>
          <div className="md-cell md-cell--4">
            <Card className="md-block-centered" raise={true}>
                <Media>
                  <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                  <MediaOverlay>
                    <CardTitle title="mysiteasdfwejlk34.com">
                      <Button className="md-cell--right" icon>star_outline</Button>
                    </CardTitle>
                  </MediaOverlay>
                </Media>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
                <Button flat label="Dashboard"/>
              </CardActions>
              <CardText expandable></CardText>
            </Card>
          </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)



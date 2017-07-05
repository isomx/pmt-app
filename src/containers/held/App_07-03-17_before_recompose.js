/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { MdTransitionGroup, MdTransitionHandler, transitionTypes } from '../lib/systemManager';
import { loadData } from '../actions/render';
import WebsitesPage from './WebsitesPage';
import Dashboard from './Dashboard';
import Funnels from './Funnels';
import Tree from './Tree';
import Login from './Login';
import { CSSTransitionGroup } from 'react-transition-group';
import NavDrawerMain from '../components/NavDrawerMain';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import cn from 'classnames';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    }
  }
  render() {
    const location = this.props.location;
    const transitionKey = location.pathname.split('/')[1];
    // console.log('this.props.render = ', this.props.render);
    /**
    if (!this.props.render) {
      this.props.loadData(this.props.location.pathname);
      // console.log('this.props.render = ', this.props.render);
      return null;
    }
     **/
    /**
     *
     * header={<MdToolbar
          fixed={true}
          colored={true}
          title={'Predictive Marketing'}
          nav={<Button key="nav" icon>{this.props.navIcon}</Button>}
          className={cn('md-divider-border md-divider-border--bottom')}
        />}
     <Drawer
     visible={true}
     position="left"
     navItems={navItemsResp.navItems}
     type={Drawer.DrawerTypes.TEMPORARY}
     //header={<div style={{height: '128px', backgroundColor: 'rgb(33, 150, 243)'}}>My Header Content </div>}
     //header={<div style={{height: '64px', backgroundColor: '#eeeeee'}}>My Header Content </div>}
     className="md-toolbar-relative"
     style={{zIndex: 100}}
     clickableDesktopOverlay
     />



     <MdTransitionGroup name='root' transitionType={transitionTypes.SURFACE_EXPAND}>
     <MdTransitionHandler key={transitionKey} name={transitionKey}>
     <Route key={location.key + 'dashboard'} path="/dashboard" render={ props => <DashboardPage {...props} />} />
     <Route key={location.key + 'websites'} path="/websites" render={ props => <WebsitesPage {...props} /> } />
     <Route key={location.key + 'funnels'} path="/funnels" render={ props => <FunnelsPage {...props} /> } />
     <Route key={location.key + 'tree'} path="/tree" render={ props => <TreeContainer {...props} treeId="groupTree2" /> } />
     </MdTransitionHandler>
     </MdTransitionGroup>

     <NavDrawerMain/>

     <CSSTransitionGroup transitionName="md-cross-fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
     */
    /**
    return (
      <CSSTransitionGroup transitionName="md-cross-fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        <Switch name='mainRoutes' key={transitionKey}>
          <Route path="/dashboard" render={ props => <Dashboard {...props} />} />
          <Route path="/websites" render={ props => <WebsitesPage {...props} /> } />
          <Route path="/funnels" render={ props => <Funnels {...props} /> } />
          <Route path="/tree" render={ props => <TreeContainer {...props} treeId="groupTree2" /> } />
        </Switch>
      </CSSTransitionGroup>
    );
     **/
    return (
      <MdTransitionGroup name="mainRoutes" transitionType={transitionTypes.CROSS_FADE}>
          <Switch name='mainRoutes' key={transitionKey}>
            <Route path="/dashboard" render={ props => <Dashboard {...props} />} />
            <Route path="/websites" render={ props => <WebsitesPage {...props} /> } />
            <Route path="/funnels" render={ props => <Funnels {...props} /> } />
            <Route path="/tree" render={ props => <Tree {...props} /> } />
            <Route path="/login" render={ props => <Login {...props} /> } />
          </Switch>
      </MdTransitionGroup>
    );
  }
}


function mapStateToProps(store, ownProps) {
  // console.log('location = ', ownProps.location);
  return {
    locationState: ownProps.location.state ? ownProps.location.state.mdTransition : null,
    location: ownProps.location,
    render: store.render[ownProps.location.pathname],
  };
}

function mapDispatchToProps(dispatch, state) {
  return {
    dispatch,
    loadData: loadData(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

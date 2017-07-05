/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { MdTransitionGroup, MdTransitionHandler, transitionTypes } from '../lib/systemManager';
import WebsitesPage from './WebsitesPage';
import DashboardPage from './DashboardPage';
import FunnelsPage from './FunnelsPage';
import Toolbar from '../components/Toolbar';
import TreeContainer from './TreeContainer';


class App extends Component {
  constructor(props) {
    super(props);
  }

  /**
   <MdTransitionGroup transitionManager={this.transitionManager} childRefId={location.pathname} name='root'>
   <MdTransitionHandler key={transitionKey + '3'} lifecycleManager={this.lifecycleManager} name={transitionKey}>
   <Route key={location.key + 'dashboard'} path="/dashboard" render={ props => <DashboardPage {...props} />} />
   <Route key={location.key + 'websites'} path="/websites" render={ props => <WebsitesPage {...props} /> } />
   <Route key={location.key + 'funnels'} path="/funnels" render={ props => <FunnelsPage {...props} /> } />
   </MdTransitionHandler>
   </MdTransitionGroup>
   **/
  render() {
    const location = this.props.location;
    const transitionKey = location.pathname.split('/')[1];
    return (
    <div>
      <Toolbar title={location.pathname} />
      <MdTransitionGroup name='root' transitionType={transitionTypes.SURFACE_EXPAND}>
        <MdTransitionHandler key={transitionKey} name={transitionKey}>
          <Route key={location.key + 'dashboard'} path="/dashboard" render={ props => <DashboardPage {...props} />} />
          <Route key={location.key + 'websites'} path="/websites" render={ props => <WebsitesPage {...props} /> } />
          <Route key={location.key + 'funnels'} path="/funnels" render={ props => <FunnelsPage {...props} /> } />
          <Route key={location.key + 'tree'} path="/tree" render={ props => <TreeContainer {...props} treeId="groupTree2" /> } />
        </MdTransitionHandler>
      </MdTransitionGroup>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

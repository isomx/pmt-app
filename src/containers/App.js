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
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import NavDrawerMain from '../components/NavDrawerMain';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import cn from 'classnames';

import componentFromStream from 'recompose/componentFromStream';
import mapPropsStream from 'recompose/mapPropsStream';
import renderComponent from 'recompose/renderComponent';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { Observable } from 'rxjs/Observable';

import rxjsConfig from 'recompose/rxjsObservableConfig';
import setObservableConfig from 'recompose/setObservableConfig';
setObservableConfig(rxjsConfig);

const Render = props => {
  console.log('render props = ', props);


}
const App2 = config => {
  console.log('config = ', config);
  const render = props => {
    //console.log('render props = ', props);
    console.log('APP2 RENDERING');
    return (<WebsitesPage />);
    return (
      <h1>int = {props.int}, int2 = {props.int2}</h1>
    )
  };
  const parentProps$ = props$ => {
    const int$ = Observable.interval(1000).startWith(1)
      .map(v => {
        //console.log('v = ', v);
        return v;
      }).take(3);
    return props$.distinctUntilChanged().combineLatest(int$, ({...props}, int) => {
      //console.log('parentProps = ', props);

      return {...props, int};
    })
  };
  const mapPropsStream$ = [parentProps$];
  const mapProps$ = props$ => {
    const routes$ = props$.filter(p => {
      //console.log('p = ', p);
      return p;
    }).startWith(config);
    const int2$ = Observable.interval(1500)
      .map(v => {
        //console.log('v = ', v);
        return v;
      }).take(2);
    return props$.distinctUntilChanged().combineLatest(int2$, ({...props}, int2) => {
      //console.log('props = ', props);
      //console.log('state = ', state);
      //return render(props);
      //return <Toolbar />
      return ({...props, int2});
    })
  };
  if (!config.props) return render(config);
  const enhance = getContext({mdTransitionParentId: PropTypes.string});
  //const Component = mapPropsStream(mapProps$)(Toolbar);
  //const Component = enhance(componentFromStream(mapProps$));
  const Component = mapPropsStream(compose(...mapPropsStream$, mapProps$))(render);
  //const Component = compose(mapPropsStream(mapProps$), enhance)(render);
  return (<Component />);
  if (config.data) {

  }
};

const App = config => {
  console.log('config = ', config);
  const AppRender = App2(config);
  const render = props => {
    // console.log('render props = ', props);
    console.log('APP1 RENDERING');
    //const AppRender = App2(config);
    //return <div>{AppRender}</div>
    //return <Toolbar children={AppRender}/>
    //return <App2 {...config}/>
    return (
      <div>
        <h1>int = {props.int}, int2 = {props.int2}</h1>
        {AppRender}
      </div>
    )
  };
  const parentProps$ = props$ => {
    const int$ = Observable.interval(3000).startWith(1)
      .map(v => {
        //console.log('v = ', v);
        return v;
      }).take(3);
    return props$.combineLatest(int$, ({...props}, int) => {
      //console.log('parentProps = ', props);

      return {...props, int};
    })
  };
  const mapPropsStream$ = [parentProps$];
  const mapProps$ = props$ => {
    const routes$ = props$.filter(p => {
      //console.log('p = ', p);
      return p;
    }).startWith(config);
    const int2$ = Observable.interval(2500)
      .map(v => {
        //console.log('v = ', v);
        return v;
      }).take(5);
    return props$.distinctUntilChanged().combineLatest(int2$, ({...props}, int2) => {
      //console.log('props = ', props);
      //console.log('state = ', state);
      //return render(props);
      //return <Toolbar />
      return ({...props, int2});
    })
  };
  //if (!config.props) return render(config);
  const enhance = getContext({mdTransitionParentId: PropTypes.string});
  //const Component = mapPropsStream(mapProps$)(Toolbar);
  //const Component = enhance(componentFromStream(mapProps$));
  const Component = mapPropsStream(compose(...mapPropsStream$, mapProps$))(render);
  //const Component = compose(mapPropsStream(mapProps$), enhance)(render);
  return (<Component />);
  if (config.data) {

  }
}


class AppClass extends Component {
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

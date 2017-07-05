/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
// import Card from 'react-md/lib/Cards/Card';
// import CardTitle from 'react-md/lib/Cards/CardTitle';
// import CardActions from 'react-md/lib/Cards/CardActions';
// import CardText from 'react-md/lib/Cards/CardText';
// import Media, { MediaOverlay } from 'react-md/lib/Media';
// import Avatar from 'react-md/lib/Avatars';
// import Button from 'react-md/lib/Buttons';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import TweenMax, { Power2 } from 'gsap';
import Home from './funnels/Home';
import Toolbar from '../components/Toolbar';
// import NavigationDrawer from 'react-md/lib/NavigationDrawers';
// import getNavItems from '../constants/navItems';
// import ToolbarMenu from '../components/ToolbarMenu';
// import DashboardPage from './DashboardPage';
import Manage from './funnels/Manage';
import '../scss/components/_FunnelsPage.scss';
// import ReactTransitionGroup from 'react-addons-transition-group';
// const imgSrc = 'http://freedomlifestylenetwork.com/app/img/screenshots/s_74_0.jpg';

class FunnelsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteId: 0,
      inTrans: false,
      left: 0,
      width: 0,
      top: 0
    };
    this.registerElem = this.registerElem.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.recordPosition = this.recordPosition.bind(this);
    this.elem = null;
  }

  handleClick(e) {
    console.log('e = ', e);
    const rect = e.target.getBoundingClientRect();
    const { left, width, top } = rect;
    // console.log('rect = ', rect);
    const elem = this.elem;
    // TweenMax.fromTo(elem,0.5, {x: left, y: top}, {x: 0, y: 0, width: 1900, height: 2000, ease: Power2.easeIn});
    // TweenMax.to(elem,0.5, {x: -left, height: 3000, width: 1900, ease: Power2.easeIn});

  }

  registerElem(elem) {
    if (elem) {
      this.elem = elem;
    }
  }

  componentWillAppear(callback) {
    console.log('FunnelsPage - Will Appear');
    //callback();
  }

  componentWillEnter(callback) {
    console.log('FunnelsPage - Will Enter');
    //callback();
  }

  componentWillLeave(callback) {
    console.log('FunnelsPage - Will Leave');
    //callback();
  }

  recordPosition(elem) {

  }

  render() {
    /**
     <ReactCSSTransitionGroup
     transitionName="example23"
     transitionAppear={true}
     transitionAppearTimeout={500}
     transitionEnterTimeout={500}
     transitionLeaveTimeout={300}
     >
     */
    // <Toolbar title={this.props.location.pathname} />
    return(
      <div key={this.props.location.key} ref={(elem) => this.elem = elem}>
        <Route exact path="/funnels" render={({ props }) => (
          <Home key={location.key} beforeNav={this.recordPosition} />
        )} />
        <Route exact path="/funnels/manage" render={({ props }) => (
          <Manage key={location.key} beforeNav={this.recordPosition} />
        )} />
      </div>
    );
  }
}

function mapStateToProps(store, ownProps) {
  // console.log('store = ', store);
  return {};
}

function mapDispatchToProps(dispatch, state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnelsPage);
/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import Button from 'react-md/lib/Buttons';
import { MdTransitionEvent, MdTransitionAnchor, MdTransitionElement } from '../../lib/systemManager';
import { toDashboard } from '../../actions/nav';

const imgSrc = 'http://freedomlifestylenetwork.com/app/img/screenshots/s_74_0.jpg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runCount: 0,
    };
    this.registerElem = this.registerElem.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.elem = null;
    this.navIn = this.navIn.bind(this);
    this.state = {
      runCount: 1,
    }
  }

  handleClick(e) {
    console.log('e = ', e);
    const rect = e.target.getBoundingClientRect();
    const { left, width, top } = rect;
    // console.log('rect = ', rect);
    const elem = this.elem;
    // TweenMax.fromTo(elem,0.5, {x: left, y: top}, {x: 0, y: 0, width: 1900, height: 2000, ease: Power2.easeIn});
    TweenMax.to(e.target,0.5, {x: -left, height: 3000, width: 1900, ease: Power2.easeIn});

  }

  componentDidMount() {
    //source$.next('hello from Home page');
    //console.log('this.props = ', this.props);
    // this.props.navTransitionIn('/dashboard');

  }

  registerElem(elem) {
    if (elem) {
      this.elem = elem;
    }
  }

  componentWillAppear(callback) {
    console.log('Home - Will Appear');
    //callback();
  }

  componentWillEnter(callback) {
    console.log('Home - Will Enter');
    //callback();
  }

  componentWillLeave(callback) {
    console.log('Home - Will Leave');
    //callback();
  }

  navIn(e, url) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    // this.props.navTransitionIn(this.props.location, url, {left: rect.left, top: rect.top, width: rect.width, height: rect.height});
    this.props.navTransitionIn(e, url);
  }
  buildStoreTree(data) {
    let tree = [], childrenOf = {}, item, id, parentId;
    for (let i = 0, length = data.length; i < length; i++) {
      item = data[i];
      id = item.id;
      parentId = item.parentId || 0;
      // every item may have children
      childrenOf[id] = childrenOf[id] || [];
      // init its children
      item.children = childrenOf[id];
      if (parentId == 0) {
        tree.push(item);
      } else {
        // init its parent's children object
        childrenOf[parentId] = childrenOf[parentId] || [];
        // push it into its parent's children object
        childrenOf[parentId].push(item);
      }
    };
    console.log('tree = ', tree);
    return tree;
  }

  render() {
    console.log('Home rendering');
    const cssTransition = false;
    /**
     <ReactCSSTransitionGroup
     transitionName="example23"
     transitionAppear={true}
     transitionAppearTimeout={500}
     transitionEnterTimeout={500}
     transitionLeaveTimeout={300}
     >
     */
    const location = {
      pathname: '/dashboard',
      state: {fromDashboard: 124}
    };
    // <section style={{ position: 'relative', width: '100%'}} className="md-grid md-grid--40-24 example">
    if (this.state.runCount === 1) {
      setTimeout(() => {
        // this.setState({runCount: 2});
      }, 2000);
    }
    // <Card style={{ height: '100%' }} className="md-block-centered" raise={true}>
    // <MdTransitionAnchor component={Card} name="card1" className="md-block-centered" raise={true}>
    return(
      <section className="md-grid md-grid--40-24 example" style={{background: '#fafafa'}}>
        <div className="md-cell md-cell--4">
          <Card className="md-block-centered" raise={true}>
            <MdTransitionElement name="card14">
              <Media>
                <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                <MediaOverlay>
                  <CardTitle title="mysiteasdfwejlk34.com">
                    <Button className="md-cell--right" icon>star_outline</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
            </MdTransitionElement>
            <CardTitle
              title="Card Title"
              subtitle="Card Subtitle"
            />
            <CardActions expander>
              <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
              <MdTransitionEvent name="event13" render={(props) =>
                <Button flat label="Dashboard" onClick={(event) => {
                  props.recordPosition();
                  this.props.toDashboard();
                }} />
              } />
            </CardActions>
            <CardText expandable></CardText>
          </Card>
        </div>
        <div className="md-cell md-cell--4">
          <Card className="md-block-centered" raise={true}>
            <MdTransitionElement name="card14">
              <Media>
                <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                <MediaOverlay>
                  <CardTitle title="mysiteasdfwejlk34.com">
                    <Button className="md-cell--right" icon>star_outline</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
            </MdTransitionElement>
            <CardTitle
              title="Card Title"
              subtitle="Card Subtitle"
            />
            <CardActions expander>
              <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
              <MdTransitionEvent name="event13" render={(props) =>
                <Button flat label="Dashboard" onClick={(event) => {
                  props.recordPosition();
                  this.props.toDashboard();
                }} />
              } />
            </CardActions>
            <CardText expandable></CardText>
          </Card>
        </div>
        <div className="md-cell md-cell--4">
          <Card className="md-block-centered" raise={true}>
            <MdTransitionElement name="card14">
              <Media>
                <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                <MediaOverlay>
                  <CardTitle title="mysiteasdfwejlk34.com">
                    <Button className="md-cell--right" icon>star_outline</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
            </MdTransitionElement>
            <CardTitle
              title="Card Title"
              subtitle="Card Subtitle"
            />
            <CardActions expander>
              <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
              <MdTransitionEvent name="event13" render={(props) =>
                <Button flat label="Dashboard" onClick={(event) => {
                  props.recordPosition();
                  this.props.toDashboard();
                }} />
              } />
            </CardActions>
            <CardText expandable></CardText>
          </Card>
        </div>
        <div className="md-cell md-cell--4">
          <Card className="md-block-centered" raise={true}>
              <MdTransitionElement name="card11">
                <Media>
                  <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                  <MediaOverlay>
                      <CardTitle title="mysiteasdfwejlk34.com">
                        <Button className="md-cell--right" icon>star_outline</Button>
                      </CardTitle>
                  </MediaOverlay>
                </Media>
              </MdTransitionElement>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
                  <MdTransitionEvent name="event11" render={(props) =>
                    <Button flat label="Dashboard" onClick={(event) => {
                      props.recordPosition();
                      this.props.toDashboard();
                    }} />
                  } />
              </CardActions>
              <CardText expandable></CardText>
          </Card>
        </div>
        <MdTransitionAnchor name="card13" render={(anchorData) => {
          return (
            <div ref={anchorData.registerDOMElem} className="md-cell md-cell--4">
              <Card className="md-block-centered" raise={true}>
                <MdTransitionElement name="card13">
                  <Media>
                    <img src={imgSrc} role="presentation" />
                  </Media>
                </MdTransitionElement>

                <CardTitle
                  title="Card Title"
                  subtitle="Card Subtitle"
                />
                <CardActions expander>
                  <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
                  <MdTransitionEvent name="event13" render={(props) =>
                    <Button flat label="Dashboard CLICK HERE" onClick={(event) => {
                      props.recordPosition();
                      this.props.toDashboard();
                    }} />
                  } />
                </CardActions>
              </Card>
            </div>
          );
        }} />
        <div className="md-cell md-cell--4">
          <Card className="md-block-centered" raise={true}>
            <MdTransitionElement name="card14">
              <Media>
                <img src={imgSrc} role="presentation" onClick={(e) => { this.props.routeTransition(e, '/dashboard'); }}/>
                <MediaOverlay>
                  <CardTitle title="mysiteasdfwejlk34.com">
                    <Button className="md-cell--right" icon>star_outline</Button>
                  </CardTitle>
                </MediaOverlay>
              </Media>
            </MdTransitionElement>
            <CardTitle
              title="Card Title"
              subtitle="Card Subtitle"
            />
            <CardActions expander>
              <Button flat label="MANAGE" onClick={(e) => { this.navIn(e, '/funnels/manage') } } />
              <MdTransitionEvent name="event13" render={(props) =>
                <Button flat label="Dashboard" onClick={(event) => {
                  props.recordPosition();
                  this.props.toDashboard();
                }} />
              } />
            </CardActions>
            <CardText expandable></CardText>
          </Card>
        </div>
        <div className="md-cell md-cell--4">
          <Card style={{ height: '100%' }} className="md-block-centered" raise={true} tableCard={true}>
            <Media>
              <img src={imgSrc} role="presentation" />
              <MediaOverlay>
                <CardTitle title="Site 4" subtitle="Wow!">
                  <Button className="md-cell--right" icon>star_outline</Button>
                </CardTitle>
              </MediaOverlay>
            </Media>
            <CardTitle
              title="Card Title"
              subtitle="Card Subtitle"
            />
          </Card>
        </div>
      </section>
    );
  }
}

function mapStateToProps(store, ownProps) {
  return {};
}

function mapDispatchToProps(dispatch, state) {
  return {
    toDashboard: () => dispatch(toDashboard),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

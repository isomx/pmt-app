/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import { MdTransitionEvent, MdTransitionAnchor, MdTransitionElement } from '../lib/systemManager';
import { toFunnels } from '../actions/nav';
// import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons/Button';
import Toolbar from '../components/Toolbar';
import { MdTransitionGroup, MdTransitionHandler, transitionTypes } from '../lib/systemManager';

const imgSrc = 'http://freedomlifestylenetwork.com/app/img/screenshots/s_74_0.jpg';
class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surfaceOpen: false,
      cardOpen: false,
    };
    this.surfaceMorph = this.surfaceMorph.bind(this);
    this.cardExpand = this.cardExpand.bind(this);
  }

  componentWillUnmount() {
    console.log('DashboardPage unmounting');
  }
  componentWillMount() {
    console.log('DashboardPage mounting');
  }
  // <Toolbar title={this.props.location.pathname} />
  render() {
    // console.log('match = ', this.props.match);
    //<section key={location.key} className="md-grid md-grid--40-24  example" style={{background: '#fafafa'}}>
    // 700
    /**
     * style={{position: 'absolute',top: '360px', left: '175px', zIndex: 5}}
     * style={{position: 'fixed', top: '500px', left: '500px', zIndex: 5}}
     * backgroundColor: 'rgba(255, 145, 0, 0.9)'
     *
     *
     *
     * <MdTransitionAnchor name="surfaceMorph1" render={(anchorData) => {
                      return(

                          <div ref={anchorData.registerDOMElem} style={{position: 'absolute',top: '188px', border: '#000000 1px solid', left: '400px', zIndex: 6, width: '400px', height: '200px'}}>
                            <p>TITLE</p>
                          </div>
                      )
                    }} />
     */
    return(
      <MdTransitionAnchor name="card13" render={(anchorData) => {
        const surface = () => {
          if (this.state.surfaceOpen) {
            return (
              <MdTransitionGroup name='morphButton' transitionType={transitionTypes.SURFACE_MORPH}>
                <MdTransitionHandler key='opened' name='floatingMorphOpened'>
                  <section style={{width: '200px', position: 'absolute', zIndex: 6}} className="md-grid md-grid--40-24">
                    <MdTransitionAnchor name="surfaceMorph1" render={(anchorData) => {
                      return(

                        <div ref={anchorData.registerDOMElem} style={{position: 'absolute',top: '325px', left: '1300px', zIndex: 6, height: '200px'}} className="md-cell md-cell--12">
                          <Card style={{ height: '100%', }} className="md-block-centered" raise={true}>
                            <CardTitle
                              title="Morph Surface"
                            />
                            <CardActions>
                              <MdTransitionEvent name="morphEvent" render={(props) =>
                                <Button flat label="Close" onClick={(e) => {
                                  props.recordPosition();
                                  this.surfaceMorph();
                                }} />
                              } />
                            </CardActions>
                          </Card>
                        </div>
                      )
                    }} />
                  </section>
                </MdTransitionHandler>
              </MdTransitionGroup>
            )
          }
          //style={{position: 'fixed', top: '600px', left: '1500px', zIndex: 50}}
          //style={{position: 'fixed', top: '88px', left: '1500px', zIndex: 5}}
          // style={{position: 'fixed', top: '400px', left: '30px', zIndex: 5}}
          return (
            <MdTransitionGroup name='morphButton' transitionType={transitionTypes.SURFACE_EXPAND}>
              <MdTransitionHandler key='closed' name='floatingMorphClosed'>
                <MdTransitionAnchor name="surfaceMorph1" findById="asdfasdf" render={(anchorData) =>
                  <MdTransitionEvent name="morphEvent" render={(props) =>
                    <Button id="asdfasdf" style={{position: 'fixed', top: '88px', left: '20px', zIndex: 5}} floating secondary onClick={(e) => {
                      props.recordPosition();
                      //anchorData.registerDOMElem(e.target);
                      this.surfaceMorph();
                    }}>add</Button>
                  } />
                }>
                </MdTransitionAnchor>
              </MdTransitionHandler>
            </MdTransitionGroup>
          )
        };
        //return surface();

        const card = () => {
          if (this.state.cardOpen) {
            return (
              <MdTransitionGroup name='cardExpand' transitionType={transitionTypes.SURFACE_EXPAND}>
                <MdTransitionHandler key='opened' name='cardOpened'>
                  <MdTransitionAnchor name="cardExpand1" findById="cardOpened" render={(anchorData) => {


                      return(
                        <div>
                          <section id="cardOpened" style={{ position: 'absolute', top: '288px', left: '10px', backgroundColor: '#fafafa', width: '1700px', height: '500px', zIndex: 1}} className="md-grid md-grid--40-24 md-paper--5">
                            <div style={{backgroundColor: '#fafafa', marginLeft: '900px', width: '300px', height: '200px'}} className="md-cell md-cell--12">
                              <MdTransitionElement name="cardExpandCommon" render={(props) =>
                                <img ref={props.registerDOMElem} style={{width: '100%', height: '100%'}} src={imgSrc} role="presentation"/>
                              }/>
                            </div>
                          <div style={{backgroundColor: '#fafafa'}} className="md-cell md-cell--12">
                            <Card style={{backgroundColor: '#224f86'}} className="md-block-centered" raise={true}>
                              <CardTitle
                                title="Morph Surface"
                              />
                              <CardActions>
                                <MdTransitionEvent name="cardEvent" render={(props) =>
                                  <Button flat label="Close" onClick={(e) => {
                                    props.recordPosition();
                                    this.cardExpand();
                                  }} />
                                } />
                              </CardActions>
                            </Card>
                          </div>
                        </section>

                        </div>

                      )
                    }} />

                </MdTransitionHandler>
              </MdTransitionGroup>
            )
          }
          //style={{position: 'fixed', top: '600px', left: '1500px', zIndex: 50}}
          //style={{position: 'fixed', top: '88px', left: '1500px', zIndex: 5}}
          // style={{position: 'fixed', top: '400px', left: '30px', zIndex: 5}}
          /**
          return (
            <MdTransitionGroup name='cardExpand' transitionType={transitionTypes.SURFACE_EXPAND}>
              <MdTransitionHandler key='closed' name='cardClosed'>
                <MdTransitionAnchor name="cardExpand1" findById="asdfasdf" render={(anchorData) =>
                  <MdTransitionEvent name="cardEvent" render={(props) =>
                    <Button id="asdfasdf" style={{position: 'fixed', top: '88px', left: '20px', zIndex: 5}} floating secondary onClick={(e) => {
                      props.recordPosition();
                      //anchorData.registerDOMElem(e.target);
                      this.cardExpand();
                    }}>add</Button>
                  } />
                }>
                </MdTransitionAnchor>
              </MdTransitionHandler>
            </MdTransitionGroup>
          )
           **/
          return (
            <MdTransitionGroup name='cardExpand' transitionType={transitionTypes.SURFACE_EXPAND}>
              <MdTransitionHandler key='closed' name='cardClosed'>
                <MdTransitionAnchor name="cardExpand1" findById="cardExpander123" render={(anchorData) =>
                  <section className="md-grid md-grid--40-24">
                    <div className="md-cell md-cell--2">
                      <Card className="md-block-centered" raise={true}>
                        <MdTransitionElement name="card13">
                          <Media>
                            <img src={imgSrc} role="presentation"/>
                          </Media>
                        </MdTransitionElement>
                        <CardTitle
                          title="Card Title"
                          subtitle="Card Subtitle"
                        />
                        <CardActions expander>
                          <MdTransitionEvent name="cardEvent" render={(props) =>
                            <Button flat label="Funnels Page" onClick={(e) => {
                              props.recordPosition();
                              this.cardExpand();
                            }}/>
                          }/>
                          <Button flat label="Action 2"/>
                        </CardActions>
                      </Card>
                    </div>
                    <div className="md-cell md-cell--2">
                      <Card className="md-block-centered" raise={true}>
                        <MdTransitionElement name="card13">
                          <Media>
                            <img src={imgSrc} role="presentation"/>
                          </Media>
                        </MdTransitionElement>
                        <CardTitle
                          title="Card Title"
                          subtitle="Card Subtitle"
                        />
                        <CardActions expander>
                          <MdTransitionEvent name="cardEvent" render={(props) =>
                            <Button flat label="Funnels Page" onClick={(e) => {
                              props.recordPosition();
                              this.cardExpand();
                            }}/>
                          }/>
                          <Button flat label="Action 2"/>
                        </CardActions>
                      </Card>
                    </div>
                    <div className="md-cell md-cell--2">

                        <Card id="cardExpander123" style={{backgroundColor: '#fafafa'}} className="md-block-centered" raise={true}>
                          <MdTransitionElement name="cardExpandCommon" render={(props) =>
                            <Media>
                              <img ref={props.registerDOMElem} src={imgSrc} style={{width: '100%', height: '100%'}} role="presentation"/>
                            </Media>
                          }/>
                          <CardTitle
                            title="Card Title"
                            subtitle="Card Subtitle"
                          />
                          <CardActions expander>
                            <MdTransitionEvent name="cardEvent" render={(props) =>
                              <Button flat label="CLICK HERE" onClick={(e) => {
                                props.recordPosition();
                                this.cardExpand();
                              }}/>
                            }/>
                            <Button flat label="Action 2"/>
                          </CardActions>
                        </Card>
                    </div>
                    <div className="md-cell md-cell--2">
                      <Card className="md-block-centered" raise={true}>
                        <MdTransitionElement name="card13">
                          <Media>
                            <img src={imgSrc} role="presentation"/>
                          </Media>
                        </MdTransitionElement>
                        <CardTitle
                          title="Card Title"
                          subtitle="Card Subtitle"
                        />
                        <CardActions expander>
                          <MdTransitionEvent name="cardEvent" render={(props) =>
                            <Button flat label="Funnels Page" onClick={(e) => {
                              props.recordPosition();
                              this.cardExpand();
                            }}/>
                          }/>
                          <Button flat label="Action 2"/>
                        </CardActions>
                      </Card>
                    </div>
                    <div className="md-cell md-cell--2">
                      <Card className="md-block-centered" raise={true}>
                        <MdTransitionElement name="card13">
                          <Media>
                            <img src={imgSrc} role="presentation"/>
                          </Media>
                        </MdTransitionElement>
                        <CardTitle
                          title="Card Title"
                          subtitle="Card Subtitle"
                        />
                        <CardActions expander>
                          <MdTransitionEvent name="cardEvent" render={(props) =>
                            <Button flat label="Funnels Page" onClick={(e) => {
                              props.recordPosition();
                              this.cardExpand();
                            }}/>
                          }/>
                          <Button flat label="Action 2"/>
                        </CardActions>
                      </Card>
                    </div>
                  </section>
                }/>
              </MdTransitionHandler>
            </MdTransitionGroup>
          );
        };
        return card();

      }} />
    );
  }

  surfaceMorph() {
    this.setState({surfaceOpen: !this.state.surfaceOpen});
  }

  cardExpand() {
    this.setState({cardOpen: !this.state.cardOpen});
  }
}



function mapStateToProps(store, ownProps) {
  return {};

}

function mapDispatchToProps(dispatch, state) {
  return {
    toFunnels: () => dispatch(toFunnels),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)

/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Toolbar  from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Drawer from 'react-md/lib/Drawers';
import FontIcon from 'react-md/lib/FontIcons';
import cn from 'classnames';
import NavigationDrawer from './NavigationDrawer';
import TextField from 'react-md/lib/TextFields';
import Switch from 'react-md/lib/SelectionControls/Switch';
import { MdTransitionGroup, MdTransitionHandler, MdTransitionAnchor, transitionTypes } from '../lib/systemManager';

//import FormField from '../components/CreateAccountForm';
import FormField from '../lib/renderEngine/components/Form';

//const validate = require('validate.js');
import validate from 'validate.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccount: false,
      login: {
        username: null,
        password: null,
      },
      create: {
        fname: null,
        lname: null,
        email: null,
        password: null,
        passwordConfirm: null,
      }
    }
    this.toggleCreateAccount = this.toggleCreateAccount.bind(this);
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  toggleCreateAccount() {
    // console.log('toggleCreateAccount');
    this.setState({createAccount: !this.state.createAccount});
  }

  handleChange(value, e) {
    // console.log('value = ', value);
    // console.log('e.target.name = ', e.target.name);
    const constraints = {
      username: {
        presence: true,
        format: {
          pattern: '[a-z0-9]+',
          flags: 'i',
          message: 'can only contain a-z and 0-9',
        },
        length: {
          minimum: 3,
          tooShort: 'needs to have ${count} characters or more',
        }
      },
    }
    let isValid = validate({[e.target.name]: value}, constraints);
    // console.log('isValid = ', isValid[e.target.name]);
  }

  render() {
    // console.log('createAccount = ', this.state.createAccount);
    const backgroundStyle = {
      //marginLeft: 'auto',
      //marginRight: 'auto',
      height: `${100}px`,
      //maxHeight: `${800}px`,
    };
    const containerStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      //height: `${300}px`,
      //marginTop: `${-150}px`,
      width: '50%',
      maxWidth: `${600}px`,
      backgroundColor: '#fff',
      //maxHeight: `${800}px`,
    };
    /**
    const login = (
      <div style={containerStyle} className="md-paper md-paper--2">
        <div className="md-grid md-grid--40-24">
          <div className="md-cell md-cell--12">
            <h1>Member's Access</h1>
          </div>
          <div className="md-cell md-cell--2" />
          <TextField
            label="Username"
            id="username"
            className="md-cell md-cell--8"
            name="username"
            onChange={this.handleChange}
          />
          <div className="md-cell md-cell--2" />
          <div className="md-cell md-cell--2" />
          <TextField
            label="Password"
            type="password"
            className="md-cell md-cell--8"
            name="password"
            error
            errorText="Invalid password"
          />
          <div className="md-cell md-cell--2" />
          <div className="md-cell md-cell--2" />
          <div className="md-cell md-cell--8">
            <Switch id="switch1" name="rememberMe" label="Remember Me" defaultChecked />
          </div>
          <div className="md-cell md-cell--2" />
          <div className="md-cell md-cell--2" />
          <div className="md-cell md-cell--8">
            <Button raised primary label="Login">keyboard_arrow_right</Button>
            <Button flat label="Create Account" onClick={(e) => this.toggleCreateAccount(true)}></Button>
          </div>
          <div className="md-cell md-cell--2" />
        </div>
      </div>
    );
    const createAccount = (
      <div style={containerStyle} className="md-paper md-paper--2">
        <div className="md-grid md-grid--40-24">
          <div className="md-cell md-cell--12">
            <h1>Create Account</h1>
          </div>
          <div className="md-cell md-cell--1" />
          <TextField
            label="First Name *"
            className="md-cell md-cell--5"
            name="fname"
          />
          <TextField
            label="Last Name"
            className="md-cell md-cell--5"
            name="lname"
          />
          <div className="md-cell md-cell--1" />
          <div className="md-cell md-cell--1" />
          <TextField
            label="Email *"
            className="md-cell md-cell--10"
            name="email"
          />
          <div className="md-cell md-cell--1" />
          <div className="md-cell md-cell--1" />
          <TextField
            label="Username *"
            className="md-cell md-cell--10"
            name="username"
            helpText="Letters and numbers only"
          />
          <div className="md-cell md-cell--1" />
          <div className="md-cell md-cell--1" />
          <TextField
            label="Password *"
            type="password"
            className="md-cell md-cell--5"
            name="password"
            helpText="At least 1 uppercase letter and 1 number"
          />
          <TextField
            label="Re-Enter Password *"
            type="password"
            className="md-cell md-cell--5"
            name="password_confirm"
            helpText="Passwords must match"
          />
          <div className="md-cell md-cell--1" />
          <div className="md-cell md-cell--12"/>
          <div className="md-cell md-cell--1" />
          <div className="md-cell md-cell--10">
            <Button raised primary label="Create Account">add</Button>
            <Button flat label="Login" onClick={(e) => this.toggleCreateAccount()} />
          </div>
          <div className="md-cell md-cell--1" />
        </div>
      </div>
    );
     **/
    const showCreate = this.state.createAccount;
    // <div style={backgroundStyle} className="md-toolbar-relative md-background--primary" />
    // console.log('Login rendering');
    //const Component = FormField('something2444');
    return(
      <NavigationDrawer bottomBorder={true} zDepth={2}>
        <section className="md-toolbar-relative md-grid">
          <div className="md-cell md-cell--12">
            <MdTransitionGroup name="login" transitionType={transitionTypes.CROSS_FADE}>
              <MdTransitionHandler key={showCreate ? 'createAccount': 'memberLogin'} name="memberLogin" render={() => showCreate ? <FormField myProp='myPropValue' /> : <FormField myProp='myPropValue' />} />
            </MdTransitionGroup>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
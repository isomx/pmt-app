/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'react-md/lib/TextFields';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import { user as types } from '../constants/ActionTypes';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rememberMe: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitted = false;
    if (!this.props.loggedIn) {
      this.props.login();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginErrors && nextProps.loginErrors.length > 0) {
      this.setState({username: '', password: ''});
    }
  }

  handleInput(val, e) {
    let newState = {...this.state, [e.target.name]: e.target.value};
    this.setState(newState);
  }

  handleSubmit(e) {
    const { username, password, rememberMe } = this.state;
    this.submitted = true;
    this.props.login({username, password, rememberMe});
  }

  render() {
    if (this.props.loggedIn || this.props.loggingIn) return null;
    let loginButton;
    if (this.props.loggingIn) {
      loginButton = (
        <Button style={{marginTop: '25px'}} disabled primary raised label="Logging In">
          <CircularProgress centered={false} id="ssCircular" scale={1} />
        </Button>
      );
    } else {
      loginButton = <Button onClick={this.handleSubmit} style={{marginTop: '25px'}} primary raised label="Login">keyboard_arrow_right</Button>;
    }
    return (
      <Dialog id="LoginForm" visible={true} title="Please Login" modal>
        {this.props.loginErrors && this.submitted && <p style={{color: '#cc0000'}}>{this.props.loginErrors[0]}</p>}
        <TextField
          id="username"
          name="username"
          onChange={this.handleInput}
          label="Username"
        />
        <TextField
          id="password"
          name="password"
          onChange={this.handleInput}
          label="Password"
          type="password"
        />
        {loginButton}
      </Dialog>
    );
  }
}

function mapStateToProps(store, ownProps) {
  return {
    loggedIn: store.user.loggedIn,
    loggingIn: store.user.loggingIn,
    loginErrors: store.user.loginErrors,
  }
}

function mapDispatchToProps(dispatch, state) {
  return {
    login: (values) => dispatch({type: types.LOGIN, payload: values}),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
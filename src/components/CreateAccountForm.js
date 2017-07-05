/* eslint-disable */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import componentFromStream from 'recompose/componentFromStream';
import mapPropsStream from 'recompose/mapPropsStream';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import pure from 'recompose/pure';
import isEmpty from 'lodash/isEmpty';
import forOwn from 'lodash/forOwn';
import { MdTransitionGroup, MdTransitionHandler, transitionTypes } from '../lib/systemManager';
import cn from 'classnames';

import createEventHandler from 'recompose/createEventHandler';
import rxjsConfig from 'recompose/rxjsObservableConfig';
import setObservableConfig from 'recompose/setObservableConfig';
import withProps from 'recompose/withProps';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';
import Switch from 'react-md/lib/SelectionControls/Switch';

setObservableConfig(rxjsConfig);

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/distinctUntilChanged';


import validate from 'validate.js';
validate.validators.memberPassword = (value, options, key, attributes) => {
  //console.log('password validate, value = ', value);
  //console.log('password validate, options = ', options);
  //console.log('password validate, key = ', key);
  //console.log('password validate, attributes = ', attributes);
  return null;
  return 'is totally wrong';
};

const doSomething = (props) => {
  console.log('doSomething Props = ', props);
  return props;
}
const doSomething2 = (props) => {
  console.log('doSomething2 Props = ', props);
  return props;
}
const enhanceTimer = compose(
  mapPropsStream(props$ => {
    const timeElapsed$ = Observable.interval(2000)
    return props$.combineLatest(timeElapsed$, (props, timeElapsed) => ({
      ...props,
      timeElapsed
    }))
  }),
  doSomething,
  branch((props) => {
    const even = props.timeElapsed % 2;
    return even;
  },renderComponent((props) => <div>Odd!</div>),
    renderComponent((props) => <div>Time elapsed: {props.timeElapsed}</div>)
  ),
  doSomething2,
);
//export default enhanceTimer('hello');

const loginOrCreateTestEnhance = mapPropsStream(props$ => {
  const timeElapsed$ = Observable.interval(1500);
  return props$.combineLatest(timeElapsed$, (props, timeElapsed) => ({
    ...props,
    timeElapsed
  }))

});

const loginOrCreateTest = mapPropsStream(props$ => {

  const updateState = (acc, e) => {
    acc.value = e;
    return acc;
  }
  const constraints = {
    username: {
      presence: true,
    }
  };
    const {handler: usernameChange, stream: usernameChange$} = createEventHandler();
    const {handler: passwordChange, stream: passwordChange$} = createEventHandler();
    const {handler: rememberMeChange, stream: rememberMeChange$} = createEventHandler();
    const {handler: loginClick, stream: loginClick$} = createEventHandler();

    const username$ = usernameChange$.startWith('')
      .scan(updateState, {props: {id: 'username', onChange: usernameChange, name: 'username', label: 'Username', required: true}});
    const password$ = passwordChange$.startWith('')
      .scan(updateState, {props: {id: 'password', type: 'password', onChange: passwordChange, name: 'password', label: 'Password', required: true}});
    const rememberMe$ = rememberMeChange$.startWith('')
      .scan((acc, val) => {
        //console.log('rememberMe click, = ', val);
        return acc;
      }, {props: {id: 'rememberMeSwitch', name: 'rememberMe', label: 'rememberMe', defaultChecked: false}});
    const login$ = loginClick$.startWith('')
      .scan((acc, e) => {
        //console.log('login click, e = ', e);
        return acc;
      }, {props: {raised: true, primary: true, label: 'Login', onClick: loginClick, children: 'keyboard_arrow_right'}});

    return props$.distinctUntilChanged().combineLatest(username$, password$, rememberMe$, login$,
      (props, username, password, rememberMe, login) => {
        let values = {
          username: username.value,
          password: password.value,
          rememberMe: rememberMe.value,

        };
        //console.log('values = ', values);
        const valid = validate(values, constraints);
        //console.log('valid = ', valid);
        return {...props, username, password, rememberMe, login, values, valid};
      })
  }
)

const lFormComponent = (props) => {
  const containerStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    maxWidth: `${600}px`,
  };
  console.log('props = ', props);
  return (
    <div style={containerStyle} className="md-paper md-paper--2">
      <div className="md-grid md-grid--40-24">
        <div className="md-cell md-cell--12"><h1>Member's Access</h1></div>
        <div className="md-cell md-cell--2"/>
        <TextField {...props.username.props} className="md-cell md-cell--8"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--2"/>
        <TextField {...props.password.props} className="md-cell md-cell--8"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--2"/>
        <Switch {...props.rememberMe.props} className="md-cell md-cell--8"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--12"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--8">
          <Button {...props.login.props} />
          <Button flat label="Create Account" onClick={(e) => props.toggleCreateAccount()}/>
        </div>
        <div className="md-cell md-cell--2"/>
      </div>
    </div>
  );
};
const theForm = loginOrCreateTestEnhance(loginOrCreateTest(lFormComponent));
//export default theForm;


const lForm = loginOrCreateTest((props) => {
  const containerStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    maxWidth: `${600}px`,
  };
  console.log('props = ', props);
  return (
    <div style={containerStyle} className="md-paper md-paper--2">
      <div className="md-grid md-grid--40-24">
        <div className="md-cell md-cell--12"><h1>Member's Access</h1></div>
        <div className="md-cell md-cell--2"/>
        <TextField {...props.username.props} className="md-cell md-cell--8"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--2"/>
        <TextField {...props.password.props} className="md-cell md-cell--8"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--2"/>
        <Switch {...props.rememberMe.props} className="md-cell md-cell--8"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--12"/>
        <div className="md-cell md-cell--2"/>
        <div className="md-cell md-cell--8">
          <Button {...props.login.props} />
          <Button flat label="Create Account" onClick={(e) => props.toggleCreateAccount()}/>
        </div>
        <div className="md-cell md-cell--2"/>
      </div>
    </div>
  );
});
//export default lForm;


const serverData = [{
    id: 'loginForm',
    initActive: true,
    method: 'post',
    url: 'http://fln.dev/',
    components: [{
      id: 100,
      component: 'div',
      css: ['md-paper', 'md-paper--2'],
      style: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        maxWidth: `${600}px`,
        backgroundColor: '#fff',
      },
      children: [
        {
          id: 1,
          component: 'div',
          css: ['md-grid', 'md-grid--40-24'],
          props: {},
          children: [
            {
              id: 2,
              component: 'div',
              css: ['md-cell', 'md-cell--12'],
              props: {},
              children: [{
                id: 12,
                component: 'h1',
                componentText: "Member's Access",
              }]
            }, {
              id: 3,
              component: TextField,
              css: ['md-cell md-cell--8'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'username', name: 'loginUsername', label: 'Username', required: true},
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
                length: {
                  minimum: 5,
                  tooShort: 'needs to have %{count} characters or more',
                }
              },
            }, {
              id: 4,
              component: TextField,
              css: ['md-cell md-cell--8'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'password', type: 'password', name: 'loginPassword', label: 'Password', required: true},
              //events: {onChange: true},
              field: true,
              validation: {
                presence: true,
              }
            }, {
              id: 5,
              component: Switch,
              css: ['md-cell md-cell--8'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'rememberMeSwitch', name: 'rememberMe', label: 'rememberMe', defaultChecked: false},
              // events: {onChange: true},
              field: true,
            }, {
              id: 6,
              component: 'div',
              css: ['md-cell', 'md-cell--8'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {},
              children: [{
                id: 7,
                component: Button,
                props: {raised: true, primary: true, label: 'Login', children: 'keyboard_arrow_right'},
                //events: {onClick: true},
                button: true,
                action: 'submit',
                disableUntilValid: true,
              }, {
                id: 8,
                component: Button,
                props: {flat: true, label: 'Create Account'},
                //events: {onClick: true},
                button: true,
                action: 'switch',
                toId: 'createAccountForm',
              }]
            }
          ]
        }]
    }],
  },{
    id: 'createAccountForm',
    initActive: false,
    components: [{
      id: 101,
      component: 'div',
      css: ['md-paper', 'md-paper--2'],
      style: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50%',
        maxWidth: `${600}px`,
        backgroundColor: '#fff',
      },
      children: [
        {
          id: 9,
          component: 'div',
          css: ['md-grid', 'md-grid--40-24'],
          children: [
            {
              id: 10,
              component: 'div',
              css: ['md-cell', 'md-cell--12'],
              children: [{
                id: 11,
                component: 'h1',
                componentText: "Create Account",
              }]
            }, {
              id: 13,
              component: TextField,
              css: ['md-cell md-cell--5'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'fname', name: 'fname', label: 'First Name', required: true},
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
              }
            }, {
              id: 15,
              component: TextField,
              css: ['md-cell md-cell--5'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'lname', name: 'lname', label: 'Last Name', required: true},
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
              }
            }, {
              id: 16,
              component: TextField,
              css: ['md-cell md-cell--5'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'email', name: 'email', label: 'Email', required: true},
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
                email: true,
              }
            },{
              id: 17,
              component: TextField,
              css: ['md-cell md-cell--5'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'username', name: 'username', label: 'Username', required: true},
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
                format: {
                  pattern: '[a-z0-9]+',
                  flags: 'i',
                  message: 'can only contain a-z and 0-9',
                },
                length: {
                  minimum: 3,
                  tooShort: 'needs to have %{count} characters or more',
                }
              }
            }, {
              id: 18,
              component: TextField,
              css: ['md-cell md-cell--5'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'password', type: 'password', name: 'password', label: 'Password', required: true},
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
                memberPassword: 'some options',
              }
            }, {
              id: 19,
              component: TextField,
              css: ['md-cell md-cell--5'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              props: {id: 'confirmPassword', type: 'password', name: 'confirmPassword', label: 'Confirm Password', required: true},
              validation: ['presence'],
              // events: {onChange: true},
              field: true,
              validation: {
                presence: true,
                memberPassword: 'some options',
                equality: {
                  attribute: 'password',
                  message: 'does not match',
                }
              },
              validateStart: {
                onFocus: true,
              }
            }, {
              id: 20,
              component: 'div',
              css: ['md-cell', 'md-cell--11'],
              style: {marginLeft: 'auto', marginRight: 'auto'},
              children: [{
                id: 21,
                component: Button,
                props: {raised: true, primary: true, label: 'Create Account', children: 'add'},
                //events: {onClick: true},
                button: true,
                action: 'submit',
                disableUntilValid: false,
              }, {
                id: 22,
                component: Button,
                props: {flat: true, label: 'Login'},
                //events: {onClick: true},
                button: true,
                action: 'switch',
                toId: 'loginForm',
                disableUntilValid: false,
              }]
            }
          ]
        },
      ]
    }],
  }
];
/**
const TextField = componentFromStream(props$ => {

});
 **/


const LoginOrCreateAcct = componentFromStream(props$ => {
  console.log('props$ = ', props$);
  const subscribe = props$.combineLatest().subscribe((v) => {console.log('SUBSCRIBE v = ', v)});
  let values = {}, loaded = false, activeForm, forms = {};
  let stateStreams$ = [], streamMap = {}, streamId = 0;
  let buildingFormId; //used to communicate the formId of the form during the building process/init of state/etc

  const values$ = new BehaviorSubject({});
  const validateFields = (component) => {
    const v = values$.getValue();
    //const msgs =

  }
  let isValid = {loginForm: false, createAccountForm: false};
  const isValid$ = values$.map((v) => {
    let valid = {}, changed = false;
    forOwn(v, (fields, formId) => {
      valid[formId] = true;
      forOwn(fields, (fieldObj, field) => {
        if (!fieldObj.valid) {
          valid[formId] = false;
          //valid = false;
          return false;
        }
        if (valid[formId] !== isValid[formId]) {
          //console.log('valid[formId] !== isValid[formId]')
          changed = true;
        } else {

        }
      })
      //isValid[formId] = valid;
    })
      //console.log('isValid = ', valid);
      //console.log('isValid, v = ', v);
    //return valid;
    //console.log('isValid = ', isValid);
    if (changed) {
      //console.log('changed!');
      isValid = {...valid};
    }
    return isValid;
    }).distinctUntilChanged().subscribe((v) => console.log('subscribe, v = ', v));
  /**
  const values$ = {
    getValue: () => values,
    next: (v) => {values = v}
  };
   **/

  const addComponentState = (c) => {
    if (c.field) {
      const { handler: fh, stream: fs } = createEventHandler();
      c.events = {
        onChange: fh,
        onBlur: fh,
      };
      c.formId = buildingFormId;
      let v = values$.getValue();
      v[buildingFormId][c.props.name] = {
        value: c.value ? c.value : '',
        valid: isEmpty(c.validation) ? true : false,
      }
      values$.next(v);
      c.useStream = true;
      c.streamId = streamId;
      streamMap[buildingFormId][c.id] = streamId;
      streamId++;
      stateStreams$.push(fs.startWith(c)
       .scan((acc, e) => {
          let v = values$.getValue();
          if (e.type === 'blur') {
            // Blur
            acc.hasBlurred = true;
          } else if (typeof(e) === 'string') {
            // value change
            acc.value = e;
            acc.valid = false;
          }
          if (!isEmpty(acc.validation)) {
            let msgs;
            if (acc.validation.equality) {
              let attr = acc.validation.equality.attribute;
              msgs = validate({[acc.props.name]: acc.value, [attr]: v[acc.formId][attr].value}, {[acc.props.name]: acc.validation});
            } else {
              msgs = validate({[acc.props.name]: acc.value}, {[acc.props.name]: acc.validation});
            }
            if (msgs && msgs[acc.props.name]) {
              acc.valid = false;
              if (acc.props.error || (acc.hasBlurred || (acc.validateStart && acc.validateStart.onFocus))) {
                acc.props.error = true;
                acc.props.errorText = msgs[acc.props.name][0];
              }
            } else {
              acc.props.error = false;
              acc.props.errorText = null;
              acc.valid = true;
            }
          } else {
            acc.valid = true;
          }
          if (v[acc.formId][acc.props.name].value !== acc.value || v[acc.formId][acc.props.name].valid !== acc.valid) {
            v[acc.formId][acc.props.name] = {
              value: acc.value,
              valid: acc.valid,
            }
            values$.next(v);
          }
          console.log('acc = ', acc);
          return acc;
        })
      );
    } else if (c.button) {
      switch(c.action) {
        case 'submit':
          forms[buildingFormId].submitButton = c;
          c.formId = buildingFormId;
          const { handler: subH, stream: subS } = createEventHandler();
          c.events = {
            onClick: subH,
          };
          c.useStream = true;
          c.streamId = streamId;
          streamMap[buildingFormId][c.id] = streamId;
          streamId++;
          let subStream$;
          if (c.disableUntilValid) {
            const filteredValues$ = values$.map((v) => {
              return v[c.formId]
            })
            subStream$ = Observable.merge(filteredValues$, subS);
          } else {
            subStream$ = subS;
          }
          stateStreams$.push(subStream$.startWith(c)
            .scan((acc, e) => {
              if (!loaded) {
                //e = acc;
              }
              //console.log('submit e = ', e);
              return acc;
            }, c)
          )


          break;
        case 'switch':
          if (c.toId) {
            const { handler: sbh, stream: sbs } = createEventHandler();
            c.events = {
              onClick: sbh, // switch button handler
            };
            c.useStream = true;
            c.streamId = streamId;
            c.formId = buildingFormId;
            streamMap[buildingFormId][c.id] = streamId;
            streamId++;
            stateStreams$.push(sbs.startWith(c)
              .scan((acc, e) => {
                if (loaded) activeForm = acc.toId;
                return acc;
              }, c)
            );
          }
          break;
        default:
      }
    }
  }
  const buildChildren = (p) => {
    for (let i = 0; i < p.children.length; i++) {
      let c = p.children[i];
      if (c.field || c.button) {
        addComponentState(c);
      }
      if (c.children && c.children.length > 0) {
        buildChildren(c);
      }
    }
  }
  for(let i = 0; i < serverData.length; i++) {
    forms[serverData[i].id] = serverData[i];
    buildingFormId = serverData[i].id;
    if (serverData[i].initActive) activeForm = buildingFormId;
    let v = values$.getValue();
    v[serverData[i].id] = {};
    values$.next(v);
    streamMap[buildingFormId] = {};
    for(let ii = 0; ii < serverData[i].components.length; ii++) {
      let c = serverData[i].components[ii];
      if (c.field || c.button) {
        addComponentState(c);
      }
      if (c.children && c.children.length > 0) {
        buildChildren(c);
      }
    }
  }
  console.log('ABOUT TO COMBINE LATEST');
  return props$.combineLatest(...stateStreams$, (props, ...streamData) => {
    const formData = forms[activeForm];
    if (!formData || !formData.components) return null;
    /**
    forOwn(values[activeForm], (val, key) => {
      console.log('val = ', val);
      if (!val.valid) {
        formIsValid = false;
        return false;
      }
    });
     **/
    let container, containerChildren;
    let render = [];
    const renderChildren = (p) => {
      let cRender = [];
      for(let i = 0; i < p.children.length; i++) {
        let c = p.children[i];
        let children;
        if (c.children && c.children.length > 0) {
          children = renderChildren(c);
        }
        let sd = c.useStream ? streamData[c.streamId] : c;
        if (!sd) continue;
        if (sd.children && sd.children.length > 0) {
          children = renderChildren(sd);
          cRender.push(
            <sd.component key={sd.id} {...sd.props} {...sd.events} style={sd.style} children={children} className={cn(sd.css)}/>
          );
        } else if (sd.componentText) {
          cRender.push(
            <sd.component key={sd.id} {...sd.props} {...sd.events} style={sd.style} className={cn(sd.css)}>{sd.componentText}</sd.component>
          );
        } else {
          cRender.push(
            <sd.component key={sd.id} {...sd.props} {...sd.events} style={sd.style} className={cn(sd.css)} />
          );
        }
      }
      return cRender;
    }
    for (let i = 0; i < formData.components.length; i++) {
      let c = formData.components[i];
      let children = [];
      let sd = c.useStream ? streamData[c.streamId] : c;
      if (!sd) continue;
      if (sd.children && sd.children.length > 0) {
        children = renderChildren(sd);
      }
      if (i === 0) {
        container = c;
        containerChildren = children;
      } else {
        render.push(
          <sd.component key={sd.id} {...sd.props} {...sd.events} style={sd.style} children={children} className={cn(sd.css)} />
        );
      }
    }
    loaded = true;
    return (
      <MdTransitionGroup name="login" transitionType={transitionTypes.CROSS_FADE}>
        <MdTransitionHandler key={activeForm} name="memberLogin" render={() =>  (
          <container.component {...container.props} {...container.events} style={container.style} className={cn(container.css)} children={containerChildren} />
        )}/>
      </MdTransitionGroup>
    );
    return (
      <container.component {...container.props} {...container.events} style={container.style} className={cn(container.css)} children={containerChildren} />
    );



  })
});
export default LoginOrCreateAcct;


const CreateAccountForm = componentFromStream(props$ => {
  const { handler: fnameChange, stream: fnameChange$ } = createEventHandler();
  const { handler: lnameChange, stream: lnameChange$ } = createEventHandler();
  const { handler: emailChange, stream: emailChange$ } = createEventHandler();
  const { handler: usernameChange, stream: usernameChange$ } = createEventHandler();
  const { handler: passwordChange, stream: passwordChange$ } = createEventHandler();
  const { handler: confirmPasswordChange, stream: confirmPasswordChange$ } = createEventHandler();
  const { handler: createClick, stream: createClick$ } = createEventHandler();
  const { handler: toggleCreate, stream: toggleCreate$ } = createEventHandler();

  const fname$ = fnameChange$.startWith('')
    .scan(updateState, {props: {id: 'fname', onChange: fnameChange, name: 'fname', label: 'First Name', required: true}});
  const lname$ = lnameChange$.startWith('')
    .scan(updateState, {props: {id: 'lname', onChange: lnameChange, name: 'lname', label: 'Last Name', required: true}});
  const email$ = emailChange$.startWith('')
    .scan(updateState, {props: {id: 'email', onChange: emailChange, name: 'email', label: 'Email', required: true}});
  const username$ = usernameChange$.startWith('')
    .scan(updateState, {props: {id: 'username', onChange: usernameChange, name: 'username', label: 'Username', required: true}});
  const password$ = passwordChange$.startWith('')
    .scan(updateState, {props: {id: 'password', type: 'password', onChange: passwordChange, name: 'password', label: 'Password', required: true}});
  const confirmPassword$ = confirmPasswordChange$.startWith('')
    .scan(updateState, {props: {id: 'confirmPassword', type: 'password', onChange: confirmPasswordChange, name: 'confirmPassword', label: 'Confirm Password', required: true}});
  const create$ = createClick$.startWith('')
    .scan((acc, e) => {
      console.log('e = ', e);
      return acc;
    }, {props: {raised: true, primary: true, label: 'Create Account', onClick: createClick, children: 'add'}});

  return props$.combineLatest(fname$, lname$, email$, username$, password$, confirmPassword$, create$,
    (props, fname, lname, email, username, password, confirmPassword, create, login) => {
    let values = {
      fname: fname.value,
      lname: lname.value,
      email: email.value,
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };
    //console.log('values = ', values);
    const valid = validate(values, constraints);
    //console.log('valid = ', valid);
      return (
        <div style={containerStyle} className="md-paper md-paper--2">
          <div className="md-grid md-grid--40-24">
            <div className="md-cell md-cell--12"><h1>Create Account</h1></div>
            <div className="md-cell md-cell--1" />
            <TextField {...fname.props} className="md-cell md-cell--5" />
            <TextField {...lname.props} className="md-cell md-cell--5" />
            <div className="md-cell md-cell--1" />
            <div className="md-cell md-cell--1" />
            <TextField {...email.props} className="md-cell md-cell--10" />
            <div className="md-cell md-cell--1" />
            <div className="md-cell md-cell--1" />
            <TextField {...username.props} className="md-cell md-cell--10" />
            <div className="md-cell md-cell--1" />
            <div className="md-cell md-cell--1" />
            <TextField {...password.props} className="md-cell md-cell--5" />
            <TextField {...confirmPassword.props} className="md-cell md-cell--5" />
            <div className="md-cell md-cell--1" />
            <div className="md-cell md-cell--12" />
            <div className="md-cell md-cell--1" />
            <div className="md-cell md-cell--10">
              <Button {...create.props} />
              <Button flat label="Login" onClick={(e) => props.toggleCreateAccount()} />
            </div>
            <div className="md-cell md-cell--1" />
          </div>
        </div>
      );

    }
  );
});
// export default CreateAccountForm;


const Counter = componentFromStream(props$ => {
  const { handler: increment, stream: increment$ } = createEventHandler()
  const { handler: decrement, stream: decrement$ } = createEventHandler()
  const count$ = Observable.merge(
    increment$.mapTo(1),
    decrement$.mapTo(-1)
  )
    .startWith(0)
    .scan((count, n) => count + n, 0)
  const newStream$ = Observable.merge(
    increment$.mapTo(1),
    decrement$.mapTo(-1)
  )
    .startWith(20)
    .scan((count, n) => count + n , 0)

  return props$.combineLatest(
    count$,
    newStream$,
    (props, count, ...rest) => {
      console.log('props = ', props);
      console.log('count = ', count);
      console.log('rest = ', rest);
      return (
        <div {...props}>
          Count: {count}
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
        </div>
      )

    }
  )
})


const enhance = compose(
  withState('field', 'updateField', {value: null, valid: false}),
  withHandlers({
    change: props => (newVal) => {
      console.log('onChange call - props = ', props);
      props.updateField( n => {
        console.log('n = ', n);
        console.log('newVal = ', newVal);
        if (!n.value) n.value = newVal;
        return n;
      });
    }
  })
);
const FormField = enhance(({field, change, ...rest}) => {
  //console.log('field = ', field);
  //console.log('change = ', change);
  //console.log('rest = ', rest);
  return <Counter />
  return (
    <TextField
      label="Username"
      id="username"
      className="md-cell md-cell--8"
      name="username"
      onChange={change}
    />
  );

});
// console.log('FormField = ', FormField);
//export default FormField;

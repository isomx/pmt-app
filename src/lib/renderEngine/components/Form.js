/* eslint-disable */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import componentFromStream from 'recompose/componentFromStream';
import mapPropsStream from 'recompose/mapPropsStream';
import renderComponent from 'recompose/renderComponent';
import createEventHandler from 'recompose/createEventHandler';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import forOwn from 'lodash/forOwn';

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


import rxjsConfig from 'recompose/rxjsObservableConfig';
import setObservableConfig from 'recompose/setObservableConfig';
setObservableConfig(rxjsConfig);

import MdTextField from 'react-md/lib/TextFields';
import MdButton from 'react-md/lib/Buttons';
import MdSwitch from 'react-md/lib/SelectionControls/Switch';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';



const getServerData = () => {
  return {
    id: 'loginForm',
    component: 'Form',
    mapPropsStream: [],
    props: {method: 'post', url: 'http://fln.dev'},
    children: [
      {
        id: 2,
        component: 'div',
        css: ['md-paper', 'md-paper--2'],
        style: {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '70%',
          maxWidth: `${600}px`,
          backgroundColor: '#fff',
        },
        mapPropsStream: [],
        children: [
          {
            id: 3,
            component: 'div',
            css: ['md-grid', 'md-grid--40-24'],
            props: {},
            children: [
              {
                id: 4,
                component: 'div',
                css: ['md-cell', 'md-cell--12'],
                props: {},
                mapPropsStream: [],
                children: [
                  {
                    id: 5,
                    component: 'h1',
                    componentText: "Member's Access",
                  }
                ]
              }, {
                id: 6,
                component: MdTextField,
                css: ['md-cell', 'md-cell--8'],
                style: {marginLeft: 'auto', marginRight: 'auto'},
                props: {id: 'username', name: 'loginUsername', label: 'Username', required: true},
                mapPropsStream: [],
                options: {
                  validation: {
                    presence: true,
                    length: {
                      minimum: 5,
                      tooShort: 'needs to have %{count} characters or more',
                    }
                  }
                },
              }, {
                id: 7,
                component: MdTextField,
                css: ['md-cell', 'md-cell--8'],
                style: {marginLeft: 'auto', marginRight: 'auto'},
                props: {id: 'password', type: 'password', name: 'loginPassword', label: 'Password', required: true},
                mapPropsStream: [],
                options: {
                  validation: { presence: true }
                }
              }, {
                id: 8,
                component: MdSwitch,
                css: ['md-cell', 'md-cell--8'],
                style: {marginLeft: 'auto', marginRight: 'auto'},
                props: {id: 'rememberMeSwitch', name: 'rememberMe', label: 'rememberMe', defaultChecked: false},
                mapPropsStream: [],
              }, {
                id: 9,
                component: 'div',
                css: ['md-cell', 'md-cell--8'],
                style: {marginLeft: 'auto', marginRight: 'auto'},
                props: {},
                children: [{
                  id: 10,
                  component: MdButton,
                  props: {raised: true, primary: true, label: 'Login', children: 'keyboard_arrow_right'},
                  mapPropsStream: [],
                  options: {
                    action: 'submit',
                  }
                }, {
                  id: 11,
                  component: MdButton,
                  props: {flat: true, label: 'Create Account'},
                  mapPropsStream: [],
                }]
              }
            ]
          },
        ]
      }
    ]
  }
}

const enhanceTextField2 = mapPropsStream(props$ => {
  const src$ = Observable.interval(5000).startWith(0);
  //return props$.map(props => props);
  return props$.combineLatest(src$, (props, src) => {
    return {...props, src}
  });
});

const TextField2 = (props, extra, extra2, extra3) => {
  // console.log('TextField2 props = ', props);
  // console.log('TextField2 extra = ', extra);
  // console.log('TextField2 extra2 = ', extra2);
  // console.log('TextField2 extra3 = ', extra3);
  const propsStream = mapPropsStream(props$ => {
    const src$ = Observable.interval(5000);
    return props$.map(val => {
      // console.log('theProps, val = ', val);
      return val;
    });
    return props$.combineLatest(src$, (props, src) => {
      return {...props, src}
    })

  });
  const Component = propsStream(MdTextField);
  return <Component />;
  return renderComponent(propsStream(MdTextField));
};
/**
const TextField2 = enhanceTextField2(componentFromStream(props$ => {
  const { handler: h, stream: s } = createEventHandler();
  const onChange$ = s.startWith('')
    .scan((acc, e) => {
      acc = e;
      return acc;
    });
  return props$.combineLatest(onChange$, (props, onChange) => {
    return (
      <MdTextField {...props}/>
    )
  })
}));
 **/

const TextField = props => {
  // console.log('TextField props = ', props);
  const propsStream = mapPropsStream(props$ => {
    const src$ = Observable.interval(5000);
    return props$.map(val => {
      // console.log('theProps, val = ', val);
      return val;
    });
    return props$.combineLatest(src$, (props, src) => {
      return {...props, src}
    })

  });
  return propsStream(props);
}

const Validation = props$ => {

}

const Form = componentFromStream(props$ => {
  // console.log('props$ = ', props$);
  const theProps = props$.map(p => {
    // console.log('theProps, p = ', p)
    return p;
  }).subscribe(
    (p) => {},
    (err) => {},
    () => {}
  );
  let formData = getServerData();
  let values = {};
  const fieldsFactory = observer => {
    const {handler: h, stream: s} = createEventHandler();
    const intVal$ = Observable.interval(1000).subscribe(v => observer.next(v));
  };
  const fields$ = Observable.create(fieldsFactory);
  const streamData = {};
  return props$.combineLatest(fields$, (props, fields) => {
    let container, containerChildren;
    let render = [];
    // console.log('rendering');
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
    container = formData;
    containerChildren = formData.children && formData.children.length > 0 ? renderChildren(formData) : null;
    containerChildren.push(<TextField2 textFieldProp="someProp" />);
    /**
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
     **/
    return (
      <form>
        {containerChildren}
      </form>
    );
    return (
      <container.component {...container.props} {...container.events} style={container.style} className={cn(container.css)} children={containerChildren} />
    );
  });
});
const Form3 = props => {
  // console.log('props = ', props);
  const TheElem = TextField(Form);
  return <TheElem myProp="some prop" />
}
export default Form3;

const validation = props$ => {
  //console.log('validation, props$ = ', props$);
  const src$ = Observable.interval(800);
  return props$.combineLatest(src$, (props, src) => {
    //console.log('validation, props = ', props);
    //console.log('validation1 emitting');
    return {...props, src}
  });
};
const validation3 = props$ => {
  //console.log('validation, props$ = ', props$);
  const src$ = Observable.interval(400);
  return props$.combineLatest(src$, (props, src) => {
    //console.log('validation, props = ', props);
    //console.log('validation1 emitting');
    return {...props, src}
  });
};
const validation2 = props$ => {
  //console.log('validation 2, props$ = ', props$);
  const src$ = Observable.interval(2000);
  return props$.combineLatest(src$, (props, src2) => {
    //console.log('validation2 emitting');
    return {...props, src2}
  });
};

const TField = (props) => {
  // console.log('rendering, props = ', props);
  return (
    <TextField
      id="textField1"
      name="myFieldName"
      label="First Name"
      required
      />
  );
}

const tabs = (props) => {
  // console.log('rendering tabs, props = ', props);
  const activeTabIndex = 1;
  const handleTabChange = (e) => {};
  const CComponent = mapPropsStream(validation3)(TField);
  //return <CComponent {...props} />

  //return <Form myProps="some props"/>
  return (
    <TabsContainer onTabChange={handleTabChange} activeTabIndex={activeTabIndex} panelClassName="md-grid" colored>
      <Tabs tabId="tab">
        <Tab label="Tab One">
          <h3 className="md-cell md-cell--12">Hello, World!</h3>
        </Tab>
        <Tab label="Tab Two">
          <h3>it worked</h3>
        </Tab>
      </Tabs>
    </TabsContainer>
  );
}


const validators = [validation, validation2]
const FormValidation = mapPropsStream(compose(...validators));
//console.log('FormValidation = ', FormValidation);
const Form2 = FormValidation(tabs);
//export default Form2
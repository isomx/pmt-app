/* eslint-disable */
import React, { Component } from 'react';
import componentFromStream from 'recompose/componentFromStream';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import cn from 'classnames';
import forEach from 'lodash/forEach';
import createEventHandler from 'recompose/createEventHandler';



const Form$ = props$ => {


}


const Form = componentFromStream(props$ => {
  let values = {};
  let fields = {};
  let valuesObs;
  const values$ = Observable.create(obs => {
    valuesObs = obs;
  }).map(e => {
    values[e.target.name] = e.target.value;
    return values;
  });
  const enhanceTextField = props$ => {
    return props$.combineLatest(values$, (props, values) => {
      const { name, value, error, errorText } = props;
      props.error = true;
      props.errorText = 'My Error Text';
      return {...props}
    });
  }

  const renderChildren = (c) => {
    if (c.children && c.children.length > 0) {
      let render = [];
      forEach(c.children, (val) => {
        if (val.type === 'container') {

        } else {
          if (val.mapPropsStream && val.mapPropsStream.length > 0) {
            const component = mapPropsStream(compose(...val.mapPropsStream, enhanceTextField))
          }
        }
        const children = renderChildren(val);
        render.push(<val.component {...val.props} className={cn(val.css)} style={val.style} children={children} />);
      });
      return render;
    }
    return null;
  }
  return props$.combineLatest(values$, (props, values) => {
    const { data } = props;
    const children = renderChildren(data);
    return (
      <form>
        {children}
      </form>
    );




  });



});
export default Form;
/* eslint-disable */
import React from 'react';
import mapPropsStream from 'recompose/mapPropsStream';
import cn from 'classnames';
import compose from 'recompose/compose';
import { Observable } from 'rxjs/Observable';




const MdGrid = config => {
  const { children, initProps, initStyle, initEvents } = config;
  const render = props => {
    const { margin, gutter, alignTop, alignMiddle, alignBottom, style } = props;
    return (
      <section style={style} className={cn('md-grid', `md-grid--${margin}-${gutter}`)}>
        {props.children}
      </section>
    );
  };

  const mapProps$ = props$ => {

    console.log("mapProps$");
    const { handler: valueHandler, stream: valueStream$ } = createEventHandler();
    const handleChange = (val, e) => valueHandler(e.target.value);
    const state$ = props$.combineLatest(valueStream$.startWith(''), ({...props}, value) => {
      console.log('props = ', props);
      console.log('value = ', value);
      props.onChange = handleChange;
      return props;
    });

    return state$;
  };

  const Component = mapPropsStream(mapProps$)(render);
  console.log('setup done');
  return Component;
};

export default MdGrid;

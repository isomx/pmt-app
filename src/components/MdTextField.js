/* eslint-disable */
import React from 'react';
import TextField from 'react-md/lib/TextFields';
import createEventHandler from 'recompose/createEventHandler';
import mapPropsStream from 'recompose/mapPropsStream';
import compose from 'recompose/compose';
import { Observable } from 'rxjs/Observable';


const setupProps = {
  block: {
    name: 'Block Layout',
    description: 'Renders the text field as a full-width text field. This will disable the floating labels and remove the text divider.'
  },
  defaultValue: {
    name: 'Default Value',
    description: 'An optional default value for the text field.',
  },
  disabled: {
    name: 'Disable',
    description: 'This will render the text field in a disabled state, meaning it will not have the ability to accept values even though it will be visible.',
  },
  fullWidth: {
    name: 'Full Width',
    description: "This will make the text field's width equal the width of its container",
  },
  helpText: {
    name: 'Help Text',
    description: 'Display text below the text field. This will always be visible, unless the "Help On Focus" option is selected',
  },
  helpOnFocus: {
    name: 'Help Text Visible Only When Focused',
    description: 'This will make the help text only appear when the text field is focused.',
  },
}

const MdTextField = config => {
  const render = props => {
    console.log('render props = ', props);
    return (
      <TextField {...props}/>
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
  return (<Component {...config} />);
};

export default MdTextField;


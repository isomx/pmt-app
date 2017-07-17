/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { loadData } from '../actions/render';
import PropTypes from 'prop-types';
import Toolbar  from 'react-md/lib/Toolbars';
import cn from 'classnames';
import Button from 'react-md/lib/Buttons';
import TextField from 'react-md/lib/TextFields';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import MdTextField from '../components/MdTextField';
import DnDCell from '../components/DnDCell';
import DnDGrid from '../components/DnDGrid';

import componentFromStream from 'recompose/componentFromStream';
import mapPropsStream from 'recompose/mapPropsStream';
import renderComponent from 'recompose/renderComponent';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { Observable } from 'rxjs/Observable';

import rxjsConfig from 'recompose/rxjsObservableConfig';
import setObservableConfig from 'recompose/setObservableConfig';
setObservableConfig(rxjsConfig);

//@DragDropContext(HTML5Backend)
const App = props => {
  //console.log('props = ', props);
  //const Component = MdTextField({label: "First Name", id: "fname", name: 'fname'})
  const Component = MdTextField()
  return (
    <div>
      <DnDGrid>
        <DnDCell>
          <Component label="First Name" id="fname" name="fname" />
        </DnDCell>
        <DnDCell>
          <p>My Second Component</p>
        </DnDCell>
        <DnDCell>
          <p>My Third Component</p>
        </DnDCell>
      </DnDGrid>
    </div>
  );
}


function mapStateToProps(store, ownProps) {
  return {}
}

function mapDispatchToProps(dispatch, state) {
  return {};
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(App));
//export default connect(mapStateToProps, mapDispatchToProps)(App);

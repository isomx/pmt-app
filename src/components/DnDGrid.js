/* eslint-disable */
import React from 'react';


export default class DnDGrid extends React.Component {

  render() {
    return (
      <div className="md-grid md-grid--40-24">
        {this.props.children}
      </div>
    );
  }
}
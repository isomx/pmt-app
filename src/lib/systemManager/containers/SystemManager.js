import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RootBodyElement from '../components/RootBodyElement';
import Rx from 'rxjs/Rx';
import forOwn from 'lodash/forOwn';
import { connectSystemManager } from '../store/systemManager';
import { transitionsDispatch } from '../store/transitions';
import { treeDispatch } from '../store/tree';

class SystemManager extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      bodyElements: {},
    }
    this.addBodyElements = this.addBodyElements.bind(this);
    this.removeBodyElements = this.removeBodyElements.bind(this);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.setState = this.setState.bind(this);
    this.getNonce = this.getNonce.bind(this);
    this.id = connectSystemManager(this.addBodyElements, this.removeBodyElements, this.receiveDispatch);
  }

  receiveDispatch(action) {

  }

  getNonce() {
    let text = [];
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return text.join('');
  }

  getChildContext() {
    return {
      mdTransitionParentId: this.id,
      mdTransitionDispatch: transitionsDispatch,
      sysTreeMgrParentId: this.id,
      sysTreeMgrDispatch: treeDispatch,
    }
  }

  addBodyElements(newElems) {
    const setState = this.setState;
    return Rx.Observable.create((observer) => {
      const callback = () => observer.complete();
      setState((prevState, props) => {
        let newState = {...prevState};
        newState.bodyElements = {...prevState.bodyElements, ...newElems};
        newState.nonce = this.getNonce();
        return newState;
      }, callback);
    })
  }

  removeBodyElements(ids) {
    const setState = this.setState;
    return Rx.Observable.create((observer) => {
      const cb = () => observer.complete();
      setState((prevState, props) => {
        let newState = {...prevState};
        for(let i = 0; i < ids.length; i++) {
          delete newState.bodyElements[ids[i]];
        }
        newState.nonce = this.getNonce();
        return newState;
      }, cb);
    });
  }

  render() {
    let render = [
      <RootBodyElement key="root" update={this.state.nonce !== this.nonce ? false : true} {...this.props} />
    ];
    this.nonce = this.state.nonce;
    if (this.state.bodyElements) {
      forOwn(this.state.bodyElements, (elemData, key, obj) => {
        render.push(<RootBodyElement update={false} {...elemData} />);
      });
      return (<div>{render}</div>);
    } else {
      return render[0];
    }
  }

}

SystemManager.childContextTypes = {
  mdTransitionParentId: PropTypes.string,
  mdTransitionDispatch: PropTypes.func,
  sysTreeMgrParentId: PropTypes.string,
  sysTreeMgrDispatch: PropTypes.func,
  sysZoomPanMgrDispatch: PropTypes.func,
}

function mapStateToProps(store, ownProps) {
  return {
    location: store.router.location,

  };
}

function mapDispatchToProps(dispatch, state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemManager);
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ZoomPanContainer from '../components/ZoomPanContainer';
import TreeNode from '../components/tree/TreeNode';
import { treeActionTypes as actionTypes } from '../actions/actionTypes';
import { convertToTree } from '../utils/treeUtils';
// import { MdTransitionGroup, MdTransitionHandler, transitionTypes, MdTransitionAnchor } from '../index';


export default class TreeInstance extends Component {
  constructor(props, context) {
    super(props, context);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.parentId = this.context.sysTreeMgrParentId;
    if (this.parentId) {
      this.dispatch = this.context.sysTreeMgrDispatch;
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'treeInstance',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: this.props.name,
        }
      });
    }
    this.tree = this.props.treeData ? convertToTree(this.props.treeData) : null;
    this.state = {
      cardOpened: false,
    }
    this.enterNode = this.enterNode.bind(this);
  }

  receiveDispatch(action) {

  }

  getChildContext() {
    return {
      sysTreeMgrParentId: this.id,
    }
  }

  componentWillUnmount() {
    if (this.id) {
      this.dispatch({
        type: actionTypes.DISCONNECT_COMPONENT,
        payload: {
          id: this.id,
        }
      });
    }
  }

  enterNode() {
    this.setState({cardOpened: !this.state.cardOpened});
  }

  render() {
    if (!this.tree) {
      return null;
    }
    if (this.props.zoom || this.props.pan) {
      const {zoom, pan, zoomStep, customWidth, customHeight} = this.props;
      return (
        <ZoomPanContainer {...{zoom, pan, zoomStep, customWidth, customHeight}}>
          <TreeNode isTopLevel={true} blockUpdate={false} nodeData={this.tree[0]}/>
        </ZoomPanContainer>

      );
      /**
      if (this.state.cardOpened) {
        return (
          <MdTransitionGroup name='cardExpand' transitionType={transitionTypes.SURFACE_EXPAND}>
            <MdTransitionHandler key='opened' name='cardOpened'>
              <MdTransitionAnchor style={{backgroundColor: '#eeeeee'}} name="node171">
                <ZoomPanContainer {...{zoom, pan, zoomStep, customWidth, customHeight}}>
                  <TreeNode isTopLevel={true} blockUpdate={false} nodeData={this.tree[0]}/>
                </ZoomPanContainer>
              </MdTransitionAnchor>
            </MdTransitionHandler>
          </MdTransitionGroup>
        );
      } else {
        return (
          <MdTransitionGroup name='cardExpand' transitionType={transitionTypes.SURFACE_EXPAND}>
            <MdTransitionHandler key='closed' name='cardOpened'>
              <MdTransitionAnchor name="cardExpand1">
                <ZoomPanContainer {...{zoom, pan, zoomStep, customWidth, customHeight}}>
                  <TreeNode enterNode={this.enterNode} isTopLevel={true} blockUpdate={false} nodeData={this.tree[0]}/>
                </ZoomPanContainer>
              </MdTransitionAnchor>
            </MdTransitionHandler>
          </MdTransitionGroup>
        );
      }
       **/
    } else {
      return (
        <TreeNode isTopLevel={true} blockUpdate={false} nodeData={this.tree[0]} />
      );
    }
  }

}

TreeInstance.childContextTypes = {
  sysTreeMgrParentId: PropTypes.string,
}
TreeInstance.contextTypes = {
  sysTreeMgrParentId: PropTypes.string,
  sysTreeMgrDispatch: PropTypes.func,
}
TreeInstance.propTypes = {
  treeData: PropTypes.object.isRequired,
  zoom: PropTypes.bool,
  pan: PropTypes.bool,
  zoomStep: PropTypes.number,
  customWidth: PropTypes.string,
  customHeight: PropTypes.string,
}
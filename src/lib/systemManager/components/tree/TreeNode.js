/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { treeActionTypes as actionTypes } from '../../actions/actionTypes';
import { MdTransitionAnchor, MdTransitionEvent, MdTransitionElement } from '../../index';

import Node from '../../../../components/Node';

export default class TreeNode extends Component {
  constructor(props, context) {
    super(props, context);
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.parentId = this.context.sysTreeMgrParentId;
    if (this.parentId) {
      this.dispatch = this.context.sysTreeMgrDispatch;
      this.id = this.dispatch({
        type: actionTypes.CONNECT_COMPONENT,
        payload: {
          type: 'node',
          parentId: this.parentId,
          receiveDispatch: this.receiveDispatch,
          name: this.props.name,
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.blockUpdate = nextProps.blockUpdate;
  }

  shouldComponentUpdate() {
    return this.blockUpdate ? false : true;
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

  renderChildNodes(colorClass) {
    const childNodes = this.props.nodeData.childNodes;
    if (!childNodes || childNodes.length < 1) return null;
    const childLength = childNodes.length;
    let lines = [];
    let children = [];
    for (let i = 0; i < childLength; i++) {
      if (i < 1 || childLength === 1) {
        lines.push(<td key={'r' + i} className={'rightLine ' + colorClass}>&nbsp;</td>);
      } else {
        lines.push(<td key={'r' + i} className={'rightLine topLine ' + colorClass}>&nbsp;</td>);
      }
      if (i === (childLength - 1)) {
        lines.push(<td key={'l' + i} className={'leftLine ' + colorClass}>&nbsp;</td>);
      } else {
        lines.push(<td key={'l' + i} className={'leftLine topLine ' + colorClass}>&nbsp;</td>);
      }
      children.push(
        <td key={`node_${i}`} colSpan={2}>
          <TreeNode blockUpdate={this.props.blockUpdate} nodeData={childNodes[i]} />
        </td>
      );
    }
    return {
      lines,
      children,
      childLength,
    }

  }

  /**
   * TODO: tree data object needs colorClass as an object prop to ensure correct colors of downline lines
   * TODO: tree data object needs the nodeComponent which will render the actual node
   * @returns {XML}
   */

  render() {
    const node = this.props.nodeData;
    const colorClass = '';
    const NodeComponent = Node;
    const childRender = this.renderChildNodes(colorClass);
    if (childRender && childRender.children.length > 0) {
      const { lines, children, childLength } = childRender;
      return (
        <table key={node.id} style={{margin: `${4}px ${16}px ${4}px ${16}px`}}>
          <tbody>
          <tr>
            <td colSpan={childLength * 2}>
              <NodeComponent nodeData={node}/>
            </td>
          </tr>
          <tr className="lines">
            <td colSpan={childLength * 2}>
              <div className={'downLine ' + colorClass}>&nbsp;</div>
            </td>
          </tr>
          <tr className="lines">
            {lines}
          </tr>
          <tr className="nodes">
            {children}
          </tr>
          </tbody>
        </table>

      );

    } else {
      return (
        <table key={node.id} style={{margin: `${4}px ${16}px ${4}px ${16}px`}}>
          <tbody>
          <tr>
            <td>
              <NodeComponent nodeData={node} />
            </td>
          </tr>
          </tbody>
        </table>
      );
    }
  }
}

TreeNode.childContextTypes = {
  sysTreeMgrParentId: PropTypes.string,
}
TreeNode.contextTypes = {
  sysTreeMgrParentId: PropTypes.string,
  sysTreeMgrDispatch: PropTypes.func,
}

TreeNode.propTypes = {
  nodeData: PropTypes.object.isRequired,
  blockUpdate: PropTypes.bool.isRequired,
  isTopLevel: PropTypes.bool,
}
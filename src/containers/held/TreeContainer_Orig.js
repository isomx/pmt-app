/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTreeData } from '../services/TreeServices';
import forEach from 'lodash/forEach';
import Node from '../components/Node';

class TreeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panning: false,
      matrix: [1, 0, 0, 1, 0, 0],
      startX: this.props.startX ? this.props.startX: 0,
      startY: this.props.startY ? this.props.startY : 0,
      scale: this.props.scale ? this.props.scale : 1,
      viewPort: {
        width: this.props.scale ? (this.props.scale > 1 ? (window.innerWidth * this.props.scale) + 'px' : (window.innerWidth / this.props.scale) + 'px') : window.innerWidth + 'px',
        height: this.props.scale ? (this.props.scale > 1 ? (window.innerHeight * this.props.scale) + 'px' : (window.innerHeight / this.props.scale) + 'px') : window.innerHeight + 'px',
      },
    };
    this.initHeight = 0;
    this.initWidth = 0;
    this.container = null;
    this.elems = {};

    this.registerElem = this.registerElem.bind(this);
  }

  registerElem(id, elem) {
    if (id == 'container') {
      if (!elem) return;
      this.container = elem;
      if (this.initHeight == 0 || this.initWidth == 0) {
        console.log('calling dimensions and resize for ', this.props.treeType);
        //this.getInitDimensions(false);
        //this.resize(this.props.containerWidth, true);
      }
      //this.calculateLayout();
    } else {
      this.elems[id] = elem;
    }
  }

  renderLines(parent) {
    let html = [];
    let count = 0;
    const children = parent.childNodes;
    const colorClass = this.props.codeData[parent.code].css;
    forEach(children, (val, id) => {
      if (count < 1 || children.length === 1) {
        html.push(<td key={'r' + count} className={'rightLine ' + colorClass}>&nbsp;</td>);
      } else {
        html.push(<td key={'r' + count} className={'rightLine topLine ' + colorClass}>&nbsp;</td>);
      }
      if (count === (children.length - 1)) {
        html.push(<td key={'l' + count} className={'leftLine ' + colorClass}>&nbsp;</td>);
      } else {
        html.push(<td key={'l' + count} className={'leftLine topLine ' + colorClass}>&nbsp;</td>);
      }
      count++;
    });
    return html;
  }

  renderTree(tree, level = 0) {
    let compiled = [];
    let container;
    if (this.container) {
      //container = this.container.getBoundingClientRect();
    }
    for (let i = 0, length = tree.length; i < length; i++) {
      if (tree.hasOwnProperty(i)) {
        if (!this.elems[tree[i].id]) {
          this.elems[tree[i].id] = {};
        }
        if (tree[i].childNodes && tree[i].childNodes.length > 0) {
          const colorClass = this.props.codeData[tree[i].code].css;
          const res = this.renderTree(tree[i].childNodes, level++);
          let childNodes = [];
          forEach(res, (val, key) => {
            childNodes.push(
              <td key={key} colSpan={2}>
                {val}
              </td>
            );
          });
          compiled.push(
            <table key={tree[i].id}>
              <tbody>
              <tr>
                <td colSpan={tree[i].childNodes.length * 2}>
                  <Node node={tree[i]} scale={this.state.scale} codeData={this.props.codeData} registerElem={this.registerElem} onEnterNode={this.props.onEnterNode} />
                </td>
              </tr>
              <tr className="lines">
                <td colSpan={tree[i].childNodes.length * 2}>
                  <div className={'downLine ' + colorClass}>&nbsp;</div>
                </td>
              </tr>
              <tr className="lines">
                {this.renderLines(tree[i])}
              </tr>
              <tr className="nodes">
                {childNodes}
              </tr>
              </tbody>
            </table>
          );
        } else {
          compiled.push(
            <table key={tree[i].id}>
              <tbody>
              <tr>
                <td>
                  <Node node={tree[i]} codeData={this.props.codeData} registerElem={this.registerElem} onEnterNode={this.props.onEnterNode} />
                </td>
              </tr>
              </tbody>
            </table>
          );
        }
      }
    }
    return compiled;
  }

  getStyles() {
    return {
      //overflow: 'hidden',
      //height: this.state.viewPort.height,
      //height: '100%',
      //width: this.state.viewPort.width,
      transform: 'matrix(' + this.state.matrix.join(',') + ') scale(' + this.state.scale + ', ' + this.state.scale + ')',
      //transform: 'matrix(' + this.state.matrix.join(',') + ')',
      //transform: 'matrix3d(1.792721, 0.07394, 0, 0.000179, -0.629117, -0.114349, 0, -0.002186,0, 0, 1, 0,177, 299, 0, 1)',
      cursor: this.state.panning ? 'move' : 'default',
      transformOrigin: '50% 25%',
      position: 'relative' //relative allows you to figure the relation to its parent when in the nav boxes
    };
  }

  render() {
    if (!this.props.treeData) {
      this.props.getTreeData(this.props.treeType);
      return null;
    }
    console.log('rendering treeContainer');
    return (
      <div id="chart-container" className="orgchart" style={this.getStyles()}>
        {this.renderTree(this.props.tree)}
      </div>
    );
  }
}

function mapStateToProps(store, ownProps) {
  const treeType = 'group';
  return {
    treeData: store.tree.treeData && store.tree.treeData[treeType] ? store.tree.treeData[treeType] : null,
    tree: store.tree.tree && store.tree.tree[treeType] ? store.tree.tree[treeType] : null,
    codeData: store.tree.codeData,
    treeType,
  }
}

function mapDispatchToProps(dispatch, state) {
  return {
    getTreeData: getTreeData(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeContainer);
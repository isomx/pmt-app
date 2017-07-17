/* eslint-disable */
import React from 'react';
import { ItemTypes } from '../constants/DnDItems';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';

const cellTarget = {
  canDrop(props) {
    return true;
  },
  drop(props) {
    console.log('dropped, props = ', props);
  }
}

const collectTarget = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    getItem: monitor.getItem(),
  }
}

const cellSource = {
  beginDrag(props) {
    console.log('cellSource props = ', props);
    return {id: 1, parentId: 2};
  }
}

const collectSource = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

@DropTarget(ItemTypes.CELL, cellTarget, collectTarget)
@DragSource(ItemTypes.CELL, cellSource, collectSource)
export default class DnDCell extends React.Component {

  render() {
    const { connectDropTarget, connectDragSource, isDragging, isOver, canDrop, getItem } = this.props;
    console.log('getItem = ', getItem);
    return connectDropTarget(connectDragSource(
      <div style={{border: isOver ? '2px #cc0000 solid' : 'none', backgroundColor: canDrop ? 'rgba(254, 255, 0, 0.27)' : null}} className="md-cell md-cell--4">
        <p>This is my cell content</p>
        {this.props.children}
      </div>
    ));
  }
}
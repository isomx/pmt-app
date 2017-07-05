import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getWindowResizeStream, getViewPortDim } from '../utils/dom';
import { zoomPanActionTypes as actionTypes } from '../actions/actionTypes';
import ZoomPanElement from './ZoomPanElement';
import { zoomPanDispatch } from '../store/zoomPan';

export default class ZoomPanContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleWindowResize();
    this.receiveDispatch = this.receiveDispatch.bind(this);
    this.id = zoomPanDispatch({
      type: actionTypes.CONNECT_COMPONENT,
      payload: {
        receiveDispatch: this.receiveDispatch,
      }
    });
    this.state = {
      panning: false,
      matrix: [1, 0, 0, 1, 0, 0],
      startX: 0,
      startY: 0,
      scale: this.props.scale ? this.props.scale : 1,
      viewPort: {
        width: this.initViewPort.width,
        height: this.initViewPort.height,
      }
    };
    this.onWheel = this.onWheel.bind(this);
    this.onPanStart = this.onPanStart.bind(this);
    this.onPanMove = this.onPanMove.bind(this);
    this.onPanEnd = this.onPanEnd.bind(this);
    this.registerContainer = this.registerContainer.bind(this);
  }

  componentWillUnmount() {
    this.windowResize$.unsubscribe();
    if (this.id) {
      zoomPanDispatch({
        type: actionTypes.DISCONNECT_COMPONENT,
        payload: {
          id: this.id,
        }
      });
    }
  }

  receiveDispatch(action) {
    switch(action.type) {
      case actionTypes.CORRECT_ELEM_RECT:
        if (!this.containerRef) return null;
        const thisRect = this.containerRef.getBoundingClientRect();
        const { scale, matrix } = this.state;
        const scale2 = Math.pow(scale, 2);
        const widthAtScale = thisRect.width * scale2;
        const heightAtScale = thisRect.height * scale2;
        const correctElemRect = (rect) => {
          let newRect = {...rect};
          if (scale !== 1) {
            newRect.left = ((rect.left - thisRect.left) / thisRect.width)
              * widthAtScale
              + ((thisRect.width - widthAtScale) / 2)
              + thisRect.left;

            newRect.top = ((rect.top - thisRect.top) / thisRect.height)
              * heightAtScale
              + ((thisRect.height - heightAtScale) / 2)
              + thisRect.top;

            const dx = rect.left - newRect.left;
            const dy = rect.top - newRect.top;
            newRect.right = rect.right + dx;
            newRect.bottom = rect.bottom + dy;

            newRect.width = rect.width * scale2;
            newRect.height = rect.height * scale2;
          }
          newRect.left += matrix[4];
          newRect.right += matrix[4];
          newRect.top += matrix[5];
          newRect.right += matrix[5];
          return newRect;
        }
        return correctElemRect;
      default:
    }

  }

  getChildContext() {
    return {
      sysZoomPanMgrParentId: this.id,
    }
  }



  handleWindowResize() {
    const getState = () => {
      return {...this.state}
    };
    const setState = (newState) => {
      this.setState(newState);
    };
    const setInitViewPort = (newDim) => {
      this.initViewPort = {width: newDim.width, height: newDim.height};
    }
    const resizeSubscribe = (newDim) => {
      let state = getState();
      if (!state.viewPort) {
        setInitViewPort(newDim);
      } else {
        state.viewPort.width = newDim.width;
        state.viewPort.height = newDim.height;
        setState(state);
      }
    }
    this.windowResize$ = getWindowResizeStream().subscribe(resizeSubscribe);
    if (!this.initViewPort) {
      // this occurs if no window resizing has occurred yet, and therefore the replaySubject has nothing to return
      this.initViewPort = getViewPortDim();
    }
  }

  onWheel(e) {
    e.preventDefault();
    const zoom_step = this.props.zoomStep;
    let matrix = [].concat(this.state.matrix);
    let scale = e.deltaY > 0 ? this.state.scale - zoom_step : this.state.scale + zoom_step;
    matrix[0] = scale;
    matrix[3] = scale;
    this.setState({scale, matrix});
  }

  onPanStart(e) {
    e.stopPropagation();
    window.addEventListener('mousemove', this.onPanMove);
    window.addEventListener('touchmove', this.onPanMove);
    window.addEventListener('mouseup', this.onPanEnd);
    window.addEventListener('touchend', this.onPanEnd);
    let state = {};
    if (!e.targetTouches) { //pan on desktop
      state.startX = e.pageX - this.state.matrix[4];
      state.startY = e.pageY - this.state.matrix[5];
    } else if (e.targetTouches.length === 1) { //pan on mobile
      state.startX = e.targetTouches[0].pageX - this.state.matrix[4];
      state.startY = e.targetTouches[0].pageY - this.state.matrix[5];
    } else if (e.targetTouches.length > 1) {
      return;
    }
    state.panning = true;
    this.setState(state);
  }

  onPanMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.panning) {
      return;
    }
    let matrix = [].concat(this.state.matrix);
    if (!e.targetTouches) {
      matrix[4] = e.pageX - this.state.startX;
      matrix[5] = e.pageY - this.state.startY;
    } else if (e.targetTouches.length === 1) {
      matrix[4] = e.targetTouches[0].pageX - this.state.startX;
      matrix[5] = e.targetTouches[0].pageY - this.state.startY;
    } else if (e.targetTouches.length > 1) {
      return;
    }
    this.setState({matrix});
  }

  onPanEnd(event) {
    event.stopPropagation();
    window.removeEventListener('mousemove', this.onPanMove);
    window.removeEventListener('touchmove', this.onPanMove);
    window.removeEventListener('mouseup', this.onPanEnd);
    window.removeEventListener('touchend', this.onPanEnd);
    this.setState({panning: false});
  }

  registerContainer(ref) {
    if (ref) {
      this.containerRef = ref;
    }
  }

  render() {
    const width = this.props.customWidth ? `${this.props.customWidth}px` : `${this.state.viewPort.width}px`;
    const height = this.props.customHeight ? `${this.props.customHeight}px` : `${this.state.viewPort.height - 64}px`;
    const styles = {
      transform: `matrix(${this.state.matrix.join(',')}) scale(${this.state.scale}, ${this.state.scale})`,
      cursor: this.state.panning ? 'move' : 'default',
      transformOrigin: '50% 50%',
      position: 'relative',
      width,
      height,
      margin: '0px',
      padding: '0px',
    }
    let zoomPanProps = {};
    if (this.props.pan) {
      zoomPanProps.onMouseDown = this.onPanStart;
      zoomPanProps.onTouchStart = this.onPanStart;
    }
    if (this.props.zoom) {
      zoomPanProps.onWheel = this.onWheel;
    }
    zoomPanProps.style = {
      ...this.props.style,
      position: 'relative',
      overflow: 'hidden',
      width,
      height,
    };
    return (
      <div ref={this.registerContainer} {...zoomPanProps}>
        <div id="chart-container" className="orgchart" style={styles}>
          <ZoomPanElement update={this.state.panning ? false : true}>
            {this.props.children}
          </ZoomPanElement>
        </div>
      </div>
    )
  }
}

ZoomPanContainer.propTypes = {
  zoom: PropTypes.bool,
  pan: PropTypes.bool,
  zoomStep: PropTypes.number,
  customWidth: PropTypes.number,
  customHeight: PropTypes.number,
}
ZoomPanContainer.defaultProps = {
  zoomStep: 0.1,
}

ZoomPanContainer.childContextTypes = {
  sysZoomPanMgrParentId: PropTypes.string,
}


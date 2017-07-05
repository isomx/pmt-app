import Rx from 'rxjs';

let viewPortDim = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const windowResize$ = Rx.Observable.fromEvent(window, 'resize')
  .debounceTime(500)
  .map((e) => {
    return {
      width: e.target.innerWidth,
      height: e.target.innerHeight,
    }
  })
  .publishReplay(1)
  .refCount();

windowResize$.subscribe((dim) => {
  viewPortDim = dim;
  console.log('dim = ', dim);
  /**
   * Does not seem necessary to check if the window exists?
   * If so, move it to the windowResize$ observable

   let t = window, objVar = 'inner';
   if (!('innerWidth' in window)) {
    objVar = 'client';
    t = document.documentElement || document.body;
  }
   ...then:
   viewPortData.width = t[objVar + 'Width'];
   viewPortData.height = t[objVar + 'Height'];
   **/
});
export const getViewPortDim = () => {
  return {...viewPortDim}
}

export const getWindowResizeStream = () => {
  return windowResize$;
}


export const getScrollData = () => {
  return {
    scrollTop: window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop  || 0,
    scrollLeft: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    // clientTop: document.documentElement.clientTop  || document.body.clientTop  || 0,
    // clientLeft: document.documentElement.clientLeft || document.body.clientLeft || 0,
    viewPortWidth: viewPortDim.width,
    viewPortHeight: viewPortDim.height,
  }
}

export const getElemPosition = (elem, includeStyles = false, zoomPan = null) => {
  let resp = null;
  if (elem) {
    const rect = elem.getBoundingClientRect();
    resp = {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      height: rect.height,
      width: rect.width,
    };
    if (zoomPan) {
      if (zoomPan.offset) {
        resp.top += zoomPan.offset.y;
        resp.bottom += zoomPan.offset.y;
        resp.left += zoomPan.offset.x;
        resp.right += zoomPan.offset.x;
      }
      if (zoomPan.scale) {
        //console.log('scale offset = ', zoomPan.scaleOffset);
        let xOffset = (((1 - zoomPan.scale) * 10) * 100) * .5;
        let yOffset = (((1 - zoomPan.scale) * 10) * 100) * .25;
        xOffset = resp.left + ((Math.pow((1 - zoomPan.scale), 2) * resp.left) * .5);
        yOffset = resp.top + ((Math.pow((1 - zoomPan.scale), 2) * resp.top) * .25);
        xOffset = 0;
        yOffset = 0;
        resp.top -= yOffset;
        resp.bottom -= yOffset;
        resp.left -= xOffset;
        resp.right -= xOffset;
        resp.width *= Math.pow(zoomPan.scale, 2);
        resp.height *= Math.pow(zoomPan.scale, 2);
      }

    }
    if (includeStyles) {
      const style = elem.currentStyle || window.getComputedStyle(elem);
      // console.log('style = ', style);
      resp.style = {
        margin: {
          left: parseInt(style["margin-left"], 10) || 0,
          right: parseInt(style["margin-right"], 10) || 0,
          top: parseInt(style["margin-top"], 10) || 0,
          bottom: parseInt(style["margin-bottom"], 10) || 0,
        },
        padding: {
          left: parseInt(style["padding-left"], 10) || 0,
          right: parseInt(style["padding-right"], 10) || 0,
          top: parseInt(style["padding-top"], 10) || 0,
          bottom: parseInt(style["padding-bottom"], 10) || 0,
        },
        border: {
          left: parseInt(style["border-left"], 10) || 0,
          right: parseInt(style["border-right"], 10) || 0,
          top: parseInt(style["border-top"], 10) || 0,
          bottom: parseInt(style["border-bottom"], 10) || 0,
        },
        zIndex: style["zIndex"],
        position: style['position'],
        backgroundColor: style['backgroundColor'],
        /**
         * Below borderRadius check is because IE does not provide borderRadius, but separates them. So just assuming
         * the radius is the same all the way around and just grabbing the topLeftRadius value
         */
        borderRadius: style['borderRadius'] ? style['borderRadius'] : (style['borderTopLeftRadius'] ? style['borderTopLeftRadius'] : ''),
        top: parseInt(style['top'], 10) || 0,
        left: parseInt(style['left'], 10) || 0,
      };
    }
  }
  return resp;
}

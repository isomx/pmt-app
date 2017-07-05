import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/concat';
import { actionTypes } from '../../actions/actionTypes';
import React from 'react';
import { getScrollData, getElemPosition } from '../../utils/dom';
import { addBodyElements, removeBodyElements } from '../../store/transitions';
import { correctElemRect } from '../../store/zoomPan';
import isEmpty from 'lodash/isEmpty';
import { GSAPTLSlider } from '../../utils/GSAPTLSlider';

/**
 * NOTE: Figure out proper way to import GSAP. Doesn't seem to support modular imports very well.
 * Might be best to import it globally once vs using modules.
 * Simply using "import 'gsap'" works, but eslint fails because
 * TweenMax & TimelineMax are "undefined"...
 */
import TweenMax from 'gsap/TweenMax';
import TimelineMax from 'gsap/TimelineMax';
import 'gsap';
import CustomEase from 'gsap/CustomEase';

const surfaceExpandEase = new CustomEase('surfaceExpandEase', '0.4, 0.0, 0.2, 1');
const kappa = 0.551915024494;

export const prepareSurfaceExpand = ({ bestAnchor, bestCommon, allElems, activeElems, unhideGroupChildRefs }) => {
  const duration = 4.4;
  const scrollData = getScrollData();
  let
    correctRectForZoomPan,
    toAnchorRef,
    _toAnchorRef,
    fromAnchorRef,
    _fromAnchorRef,
    _toAnchorContainerRef,
    toCommonRef,
    _toCommonRef,
    fromCommonRef,
    toAnchor,
    toAnchorHTML,
    fromAnchor,
    fromAnchorHTML,
    toCommon,
    toCommonHTML,
    fromCommon,
    newScrollData,
    // scrollChange,
    newBodyElems = [],
    tl,
    addBodyElems$ = null,
    removeBodyElems$ = null,
    animation$ = null,
    surfaceExpand$ = null,
    reverse = false;

  const prepareAnchors = () => {
    if (isEmpty(bestAnchor)) return;
    toAnchorRef = activeElems[bestAnchor.id].receiveDispatch({type: actionTypes.ANCHOR_GET_ELEM});
    fromAnchorRef = allElems[bestAnchor.matchId].receiveDispatch({type: actionTypes.ANCHOR_GET_ELEM});
    if (toAnchorRef && fromAnchorRef) {
      let toRect = getElemPosition(toAnchorRef, true);
      let fromRect = getElemPosition(fromAnchorRef, true);
      if (allElems[bestAnchor.matchId].zoomPanId) {
        if (!correctRectForZoomPan) correctRectForZoomPan = correctElemRect(allElems[bestAnchor.matchId].zoomPanId);
        if (!correctRectForZoomPan) {
          toAnchorRef = null;
          fromAnchorRef = null;
          return;
        }
        fromRect = correctRectForZoomPan(fromRect);
      }
      let newScroll = 0;
      if (toRect.style.position !== 'fixed' && toRect.style.position !== 'absolute') {
        newScroll = toRect.top + scrollData.scrollTop + -88;
        /**
        if (reverse) {
          newScroll -= (scrollData.viewPortHeight - toRect.height) / 2;
        }
         **/
        if (newScroll < 0) newScroll = 0;
        // scrollChange = newScroll - scrollData.scrollTop;
        newScrollData = {...scrollData, scrollTop: newScroll};
      } else {
        // scrollChange = 0;
        newScrollData = {...scrollData};
      }
      /** Scroll?
       toRect.top -= scrollChange; <-- uncomment scrollChange var before using
       document.documentElement.scrollTop = document.body.scrollTop = newScroll;
       **/
      if ((toRect.width + toRect.height) < (fromRect.width + fromRect.height)) {
        reverse = true;
        const fromAnchorHolder = fromAnchorRef;
        fromAnchorRef = toAnchorRef;
        toAnchorRef = fromAnchorHolder;
        toAnchor = {...allElems[bestAnchor.matchId], rect: {...fromRect}};
        fromAnchor = {...bestAnchor, rect: {...toRect}};
      } else {
        toAnchor = {...bestAnchor, rect: {...toRect}};
        fromAnchor = {...allElems[bestAnchor.matchId], rect: {...fromRect}};
      }
      console.log('toAnchor.rect = ', toAnchor.rect);
      console.log('fromAnchor.rect = ', fromAnchor.rect);
    }
  }

  const prepareCommonElems = () => {
    if (isEmpty(bestCommon)) return;
    toCommonRef = activeElems[bestCommon.id].receiveDispatch({type: actionTypes.COMMON_ELEMENT_GET_ELEM});
    fromCommonRef = allElems[bestCommon.matchId].receiveDispatch({type: actionTypes.COMMON_ELEMENT_GET_ELEM});
    if (toCommonRef && fromCommonRef) {
      let toRect = getElemPosition(toCommonRef);
      let fromRect = getElemPosition(fromCommonRef);
      if (allElems[bestCommon.matchId].zoomPanId) {
        /**
         * I'm putting in this check for correctRectForZoomPan, even though it's probably unnecessary.
         * That's because the anchors are compiled first, and there's no way that a common element would need to
         * correct for zoom/pan, but not the anchor. Therefore, if the "prepareAnchors" function cannot access
         * the ZoomPanContainer element, it would null-out it's anchor ref's, and this function would never be called.
         * Just leaving as cheap insurance to avoid a total script failure in that outside scenario
         */
        if (!correctRectForZoomPan) {
          toCommonRef = null;
          fromCommonRef = null;
          return;
        }
        fromRect = correctRectForZoomPan(fromRect);
      }
      toRect.top += newScrollData.scrollTop;
      fromRect.top += newScrollData.scrollTop;
      if (reverse) {
        const fromCommonHolder = fromCommonRef;
        fromCommonRef = toCommonRef;
        toCommonRef = fromCommonHolder;
        toCommon = {...allElems[bestCommon.matchId], rect: {...fromRect}};
        fromCommon = {...bestCommon, rect: {...toRect}};
      } else {
        toCommon = {...bestCommon, rect: {...toRect}};
        fromCommon = {...allElems[bestCommon.matchId], rect: {...fromRect}};
      }
      toCommonHTML = toCommonRef.cloneNode(true).outerHTML;
      console.log('toCommon.rect = ', toCommon.rect);
      console.log('fromCommon.rect = ', fromCommon.rect);
    }
  }

  const prepareBodyElems = () => {
    let commonXOffset, commonYOffset;
    newBodyElems.push({ // overlay to avoid screen interaction
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: `${scrollData.viewPortHeight}px`,
        width: `${scrollData.viewPortWidth}px`,
        opacity: 0,
        zIndex: 500,
      },
      onClick: (e) => {
        e.preventDefault();
        if (reverse) {
          if (!tl.paused()) {
            tl.pause()
          } else {
            tl.reverse();
          }

        }
      },
      component: 'div',
    });
    newBodyElems.push({
      id: 'gsapTlSlider',
      style: {
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 500,
      },
      component: 'div',
    });

    const toStyle = toAnchor.rect.style, fromStyle = fromAnchor.rect.style;
    if (toCommon && fromCommon) {
      toCommonRef.style.opacity = 0; // so you can hide the commonElem before it is copied
      commonXOffset = (toAnchor.rect.left - fromAnchor.rect.left) + (fromCommon.rect.left - toCommon.rect.left);
      commonYOffset = (toAnchor.rect.top - fromAnchor.rect.top) + (fromCommon.rect.top - toCommon.rect.top);
      toAnchor.rect.commonOffset = {
        x: commonXOffset,
        y: commonYOffset,
      }
    }
    toAnchorHTML = toAnchorRef.cloneNode(true).outerHTML;
    fromAnchorHTML = fromAnchorRef.cloneNode(true).outerHTML;
    newBodyElems.push({
      render: (data) => {
        const toAnchorStyle = {
          position: 'absolute',
          top: `${-toStyle.top}px`,
          left: `${-toStyle.left}px`,
          height: `${toAnchor.rect.height}px`,
          width: `${toAnchor.rect.width}px`,
          marginTop: `${-toStyle.margin.top}px`,
          marginLeft: `${-toStyle.margin.left}px`,
          zIndex: 3,
          visibility: 'visible',
          //transform: `translate(${commonXOffset}px, ${commonYOffset}px`,
          opacity: 0,
          //overflow: 'hidden',
        };
        const fromAnchorStyle = {
          position: 'absolute',
          top: `${-fromStyle.top}px`,
          left: `${-fromStyle.left}px`,
          height: `${fromAnchor.rect.height}px`,
          width: `${fromAnchor.rect.width}px`,
          marginTop: `${-fromStyle.margin.top}px`,
          marginLeft: `${-fromStyle.margin.left}px`,
          zIndex: 2,
          transform: `translate(${-fromStyle.margin.left - fromStyle.padding.left}px, ${-fromStyle.margin.top - fromStyle.padding.top }px`,
          opacity: 1,
        };
        const containerStyle = {
          overflow: 'hidden',
          position: 'absolute',
          top: `${fromAnchor.rect.top}px`,
          left: `${fromAnchor.rect.left}px`,
          height: `${fromAnchor.rect.height}px`,
          width: `${fromAnchor.rect.width}px`,
          zIndex: 4,
          backgroundColor: toStyle.backgroundColor,
          //transformOrigin: '50% 25%',
          //transform: 'scale(0.5, 0.5)',
          opacity: 1,
        };
        return (
          <div ref={(ref) => _toAnchorContainerRef = ref} style={containerStyle} className="md-paper--5">
            <div ref={(ref) => _toAnchorRef = ref} style={toAnchorStyle} dangerouslySetInnerHTML={{__html: toAnchorHTML}} />
            <div ref={(ref) => _fromAnchorRef = ref} style={fromAnchorStyle} dangerouslySetInnerHTML={{__html: fromAnchorHTML}} />
          </div>
        );
      }
    });
    if (toCommon && fromCommon) {
      newBodyElems.push({
        render: (data) => {
          const style = {
            position: 'absolute',
            top: `${fromCommon.rect.top}px`,
            left: `${fromCommon.rect.left}px`,
            height: `${fromCommon.rect.height}px`,
            width: `${fromCommon.rect.width}px`,
            zIndex: 4,
            opacity:0.2,
          };
          return (
            <div ref={(ref) => _toCommonRef = ref} style={style} dangerouslySetInnerHTML={{__html: toCommonHTML}} />
          );
        }
      });
    }

    const addBodyElemsResp = addBodyElements(newBodyElems);
    if (addBodyElemsResp) {
      addBodyElems$ = addBodyElemsResp.add$;
      removeBodyElems$ = removeBodyElements(addBodyElemsResp.ids);
    }
  }

  const getBezierFor = (what) => {
    let
      p0 = { x: 0, y: 0 },
      p1 = { x: 0, y: 0 },
      p2 = { x: 0, y: 0 },
      p3 = { x: 0, y: 0 },
      dx, dy;

    if (what === 'anchorContainer') {
      if (reverse) {
        p3.x = (toAnchor.rect.left - toAnchor.rect.style.left) - fromAnchor.rect.left;
        p3.y = toAnchor.rect.style.top - fromAnchor.rect.top;
      } else {
        p3.x = toAnchor.rect.left - fromAnchor.rect.left;
        p3.y = toAnchor.rect.top - fromAnchor.rect.top;
      }
    } else if (what === 'common') {
      p3.x = (toCommon.rect.left - fromCommon.rect.left) - (toAnchor.rect.left - toAnchor.rect.style.left);
      p3.y = (toCommon.rect.top - fromCommon.rect.top) - (toAnchor.rect.top - toAnchor.rect.style.top);
      console.log('common p3.x = ', p3.x);
      console.log('common p3.y = ', p3.y);
    } else if (what === 'fromAnchor') {
      p3.x = (toCommon.rect.left - fromCommon.rect.left) - (toAnchor.rect.left - fromAnchor.rect.left);
      p3.y = (fromAnchor.rect.top - toAnchor.rect.top) + (toCommon.rect.top - fromCommon.rect.top);
    } else if (what === 'toAnchor') {
      p0.x = toAnchor.rect.commonOffset.x;
      p0.y = toAnchor.rect.commonOffset.y;
      p3.x = 0;
      p3.y = 0;
      dx = p3.x - p0.x;
      dy = p3.y - p0.y;
      if (p3.y < p0.y) {
        p1.x = p0.x;
        p1.y = p0.y + (dy * kappa);
        p2.x = p3.x - (dx * kappa);
        p2.y = p3.y;
      } else {
        p1.x = p0.x + (dx * kappa);
        p1.y = p0.y;
        p2.x = p3.x;
        p2.y = p3.y - (dy * kappa);
      }
      return { values: [p0, p1, p2, p3], type: 'cubic' };
    }

    dx = p3.x - p0.x;
    dy = p3.y - p0.y;
    if (p3.y > p0.y) {
      p1.x = p0.x;
      p1.y = p0.y + (dy * kappa);
      p2.x = p3.x - (dx * kappa);
      p2.y = p3.y;
    } else {
      p1.x = p0.x + (dx * kappa);
      p1.y = p0.y;
      p2.x = p3.x;
      p2.y = p3.y - (dy * kappa);
    }
    return { values: [p0, p1, p2, p3], type: 'cubic' };
  }

  const prepareAnimation = () => {
    animation$ = Observable.create((observer) => {
      if (!_toAnchorContainerRef || !_toAnchorRef || !_fromAnchorRef) {
        observer.complete();
        return;
      }
      const anchorContainerBezier = getBezierFor('anchorContainer');
      tl = new TimelineMax({paused: true, onComplete: () => {
        TweenMax.set([toAnchorRef, toCommonRef], {opacity: 1});
        if (unhideGroupChildRefs) TweenMax.set(unhideGroupChildRefs, {opacity: 1});
        observer.complete();
      }, onReverseComplete: () => {
        TweenMax.set(fromAnchorRef, {opacity: 1});
        observer.complete();
      }});
      if (toCommonRef && fromCommonRef) {
        const commonBezier = getBezierFor('common');
        const fromAnchorBezier = getBezierFor('fromAnchor');
        const toAnchorBezier = getBezierFor('toAnchor');
        console.log('commonBezier = ', commonBezier);
        tl.to(_fromAnchorRef, duration, {
          ease: surfaceExpandEase,
          bezier: fromAnchorBezier,
        }, 0)
          .to(_toAnchorRef, duration, {
            ease: surfaceExpandEase,
            bezier: toAnchorBezier,
          }, 0)
          .to(_toCommonRef, duration, {
            bezier: commonBezier,
            width: toCommon.rect.width,
            height: toCommon.rect.height,
            ease: surfaceExpandEase,
        },0);
      }

      //tl.set(_toAnchorContainerRef, {width: toAnchor.rect.width, height: toAnchor.rect.height}, 0);
      tl.to(_toAnchorContainerRef, duration, {
        bezier: anchorContainerBezier,
        ease: surfaceExpandEase,
        width: toAnchor.rect.width,
        height: toAnchor.rect.height,
      }, 0)
        .to(_fromAnchorRef, duration * .2, {
        opacity: 0,
      }, 0)
        .to(_toAnchorRef, duration * .333, {opacity: 1}, duration * 0.2);

      if (reverse) {
        if (unhideGroupChildRefs) TweenMax.set(unhideGroupChildRefs, {opacity: 1});
        TweenMax.set(toAnchorRef, {opacity: 0});
        tl.reverse(0);
      } else {
        tl.play(0);
        new GSAPTLSlider(tl, 'gsapTlSlider', {width: 300});
      }

    });
  }
  prepareAnchors();
  if (toAnchor && fromAnchor) {
    prepareCommonElems();
    prepareBodyElems();
    if (addBodyElems$ && removeBodyElems$) {
      prepareAnimation();
      surfaceExpand$ = Observable.concat(addBodyElems$, animation$, removeBodyElems$);
    }
  }
  if (!surfaceExpand$) surfaceExpand$ = Observable.empty();
  return surfaceExpand$;
}


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/empty';
import { actionTypes } from '../../actions/actionTypes';
import React from 'react';
import { getScrollData, getElemPosition } from '../../utils/dom';
import { addBodyElements, removeBodyElements } from '../../store/transitions';
import isEmpty from 'lodash/isEmpty';
import { GSAPTLSlider } from '../../utils/GSAPTLSlider';

/**
 * NOTE: Figure out proper way to import GSAP.
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

export const prepareSurfaceMorph = ({ bestAnchor, allElems, activeElems, unhideGroupChildRefs }) => {
  const duration = 0.3;
  const scrollData = getScrollData();
  let
    p0 = { x: 0, y: 0 },
    p1 = { x: 0, y: 0 },
    p2 = { x: 0, y: 0 },
    p3 = { x: 0, y: 0 },
    bezier = { values: [p0, p1, p2, p3], type: 'cubic' },
    cursor = { x: 0, y: 0 },
    toAnchorRef,
    _toAnchorRef,
    fromAnchorRef,
    _rippleContainer,
    _toAnchorContainerRef,
    toAnchor,
    toAnchorHTML,
    fromAnchor,
    newBodyElems = [],
    tl,
    addBodyElems$ = null,
    removeBodyElems$ = null,
    animation$ = null,
    surfaceMorph$ = null,
    reverse = false;

  const prepareAnchors = () => {
    if (isEmpty(bestAnchor)) return;
    toAnchorRef = activeElems[bestAnchor.id].receiveDispatch({type: actionTypes.ANCHOR_GET_ELEM});
    fromAnchorRef = allElems[bestAnchor.matchId].receiveDispatch({type: actionTypes.ANCHOR_GET_ELEM});
    if (toAnchorRef && fromAnchorRef) {
      const toRect = getElemPosition(toAnchorRef, true);
      const fromRect = getElemPosition(fromAnchorRef, true);
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
    }
  }

  const prepareBodyElems = () => {
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
    toAnchorHTML = toAnchorRef.cloneNode(true).outerHTML;
    newBodyElems.push({
      render: (data) => {
        const style = {
          position: 'absolute',
          top: `${-toStyle.top - ((toAnchor.rect.height / 2) - (fromAnchor.rect.height / 2))}px`,
          left: `${-toStyle.left - ((toAnchor.rect.width / 2) - (fromAnchor.rect.width / 2))}px`,
          height: `${toAnchor.rect.height + (toStyle.margin.top * 2)}px`,
          width: `${toAnchor.rect.width + (toStyle.margin.left * 2)}px`,
          zIndex: 2,
          opacity: 0,
        };

        const containerStyle = {
          overflow: 'hidden',
          position: 'absolute',
          top: `${(toAnchor.rect.height / 2) - (fromAnchor.rect.height / 2)}px`,
          left: `${(toAnchor.rect.width / 2) - (fromAnchor.rect.width / 2)}px`,
          height: `${fromAnchor.rect.height}px`,
          width: `${fromAnchor.rect.width}px`,
          zIndex: 3,
          opacity: 0,
          backgroundColor: fromStyle.backgroundColor,
          borderRadius: fromStyle.borderRadius,
        };
        console.log('fromStyle = ', fromStyle);
        const containerStyle2 = {
          overflow: 'hidden',
          position: 'absolute',
          top: `${fromAnchor.rect.top - ((toAnchor.rect.height / 2) - (fromAnchor.rect.height / 2))}px`,
          left: `${fromAnchor.rect.left - ((toAnchor.rect.width / 2) - (fromAnchor.rect.width / 2))}px`,
          height: `${toAnchor.rect.height}px`,
          width: `${toAnchor.rect.width}px`,
          transform: 'scale(0)',
          zIndex: 3,
          opacity: 1,
        }
        return (
          <div style={containerStyle2} ref={(ref) => _rippleContainer = ref}>
            <div ref={(ref) => _toAnchorContainerRef = ref} style={containerStyle}>
              <div ref={(ref) => _toAnchorRef = ref} style={style} dangerouslySetInnerHTML={{__html: toAnchorHTML}}/>
            </div>
          </div>
        );
      }
    });
    const addBodyElemsResp = addBodyElements(newBodyElems);
    if (addBodyElemsResp) {
      addBodyElems$ = addBodyElemsResp.add$;
      removeBodyElems$ = removeBodyElements(addBodyElemsResp.ids);
    }
  }

  const updateBezier = () => {
    p0.x = 0;
    p0.y = 0;
    p3.x = (toAnchor.rect.left + (toAnchor.rect.width / 2) - (fromAnchor.rect.width / 2)) - fromAnchor.rect.left;
    p3.y = (toAnchor.rect.top + (toAnchor.rect.height / 2) - (fromAnchor.rect.height / 2)) - fromAnchor.rect.top;

    const dx = p3.x - p0.x;
    const dy = p3.y - p0.y;
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
  }

  const getDelay = () => {
    cursor.x = p0.x;
    cursor.y = p0.y;
    const k = 0.0001;
    const fromX = fromAnchor.rect.left;
    const fromY = fromAnchor.rect.top;
    let toX, toY, xCheck, yCheck;
    if (fromAnchor.rect.left >= toAnchor.rect.left) {
      toX = (toAnchor.rect.left + toAnchor.rect.width - (fromAnchor.rect.width));
      xCheck = (x) => x <= toX;
    } else {
      toX = toAnchor.rect.left;
      xCheck = (x) => x >= toX;
    }

    if (fromAnchor.rect.top >= toAnchor.rect.top) {
      toY = (toAnchor.rect.top + toAnchor.rect.height - (fromAnchor.rect.height));
      yCheck = (y) => y <= toY;
    } else {
      toY = toAnchor.rect.top;
      yCheck = (y) => y >= toY;
    }
    let delay = 0;
    const tween = TweenMax.to(cursor, duration, { bezier, paused: true, ease: surfaceExpandEase});

    let x, y;
    for (let i = 0; i <= 1; i += k) {
      tween.progress(i);
      x = fromX + cursor.x;
      y = fromY + cursor.y;

      if (xCheck(x) && yCheck(y)) {
        delay = tween.time();
        break;
      }
    }
    return {
      delay,
      x,
      y,
    };
  }

  const prepareAnimation = () => {
    updateBezier();
    const delayResp = getDelay();
    const delay = delayResp.delay;
    const toStyle = toAnchor.rect.style, fromStyle = fromAnchor.rect.style;
    const dt = duration - delay;
    const dx = (toAnchor.rect.width + toStyle.margin.left);
    const dy = (toAnchor.rect.height + toStyle.margin.top);

    const size = Math.sqrt(dx * dx + dy * dy);

    animation$ = Observable.create((observer) => {
      tl = new TimelineMax({paused: true, onComplete: () => {
        if (unhideGroupChildRefs) TweenMax.set(unhideGroupChildRefs, {opacity: 1});
        TweenMax.set(toAnchorRef, {opacity: 1});
        observer.complete()
      }, onReverseComplete: () => {
        TweenMax.set(fromAnchorRef, {opacity: 1});
        observer.complete();
      }});
      tl
        .to([fromAnchorRef, _rippleContainer,], duration, { bezier, ease: surfaceExpandEase }, 0)
        .set(fromAnchorRef, {opacity: 0}, delay)
        .set(_toAnchorContainerRef, {
          opacity: 1,
        }, delay)
        .set(_rippleContainer, {scale: 1}, delay)
        .to(_toAnchorContainerRef, dt, {
          width: size,
          height: size,
          ease: surfaceExpandEase,
          x: -(size / 2) + (fromAnchor.rect.width / 2),
          y: -(size / 2) + (fromAnchor.rect.height / 2),
        }, delay)
        .to(_toAnchorRef, dt, {
          x: (size / 2) - ((fromAnchor.rect.width + fromStyle.padding.left) / 2),
          y: (size / 2) - ((fromAnchor.rect.height + fromStyle.padding.top) / 2),
          ease: surfaceExpandEase,
          //opacity: 1,
        }, delay);
      if (reverse) {
        if (unhideGroupChildRefs) TweenMax.set(unhideGroupChildRefs, {opacity: 1});
        tl.to(_toAnchorRef, dt - (dt * .2), {opacity: 1}, delay + (dt * .2));
        TweenMax.set([toAnchorRef, _toAnchorContainerRef], {opacity: 0});
        tl.reverse(0);
        tl.reversed(!tl.reversed());
      } else {
        TweenMax.set(toAnchorRef, {opacity: 0});
        tl.to(_toAnchorRef, dt, {opacity: 1}, delay + (dt * .5));
        tl.play(0);
        new GSAPTLSlider(tl, 'gsapTlSlider', {width: 300});
      }
    });
  }
  prepareAnchors();
  if (toAnchor && fromAnchor) {
    prepareBodyElems();
    if (addBodyElems$ && removeBodyElems$) {
      prepareAnimation();
      surfaceMorph$ = Observable.concat(addBodyElems$, animation$, removeBodyElems$);
    }
  }
  if (!surfaceMorph$) surfaceMorph$ = Observable.empty();
  return surfaceMorph$;
}


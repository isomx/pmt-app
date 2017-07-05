/* eslint-disable */

import Rx from 'rxjs';
import { actionTypes } from '../../../actions/actionTypes';
import React from 'react';
import TimelineMax from 'gsap/TimelineMax';
import CustomEase from 'gsap/CustomEase';
import { getScrollData, getElemPosition } from '../../../utils/dom';
import { addBodyElements, removeBodyElements } from '../../../store/transitions';
import isEmpty from 'lodash/isEmpty';
import offset from 'dom-helpers/query/offset';

const surfaceExpandEase = new CustomEase('surfaceExpandEase', '0.4, 0.0, 0.2, 1');


export const prepareSurfaceExpand = ({ bestAnchor, bestCommon, allElems, activeElems, unhideGroupChildRefs }) => {
  const duration = 10.3;
  const scrollData = getScrollData();
  console.log('bestAnchor = ', bestAnchor);
  let
    toAnchorRef,
    _toAnchorRef,
    fromAnchorRef,
    _fromAnchorRef,
    _toAnchorContainerRef,
    _fromAnchorContainerRef,
    toCommonRef,
    _toCommonRef,
    fromCommonRef,
    _fromCommonRef,
    toAnchor,
    toAnchorHTML,
    fromAnchor,
    fromAnchorHTML,
    toCommon,
    toCommonHTML,
    fromCommon,
    fromCommonHTML,
    newScrollData,
    scrollChange,
    newBodyElems = [],
    tl,
    reverseTl,
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
      const toRect = getElemPosition(toAnchorRef, true);
      const fromRect = getElemPosition(fromAnchorRef, true);
      if ((toRect.width + toRect.height) < (fromRect.width + fromRect.height)) reverse = true;
      let newScroll = 0;
      if (toRect.style.position !== 'fixed') {
        newScroll = toRect.top + scrollData.scrollTop + -88;
        if (reverse) {
          newScroll -= (scrollData.viewPortHeight - toRect.height) / 2;
        }
        if (newScroll < 0) newScroll = 0;
        document.documentElement.scrollTop = document.body.scrollTop = newScroll;
        scrollChange = newScroll - scrollData.scrollTop;
        newScrollData = {...scrollData, scrollTop: newScroll};
      } else {
        scrollChange = 0;
        newScrollData = {...scrollData};
      }
      toRect.top -= scrollChange;
      toAnchor = {...bestAnchor, rect: {...toRect}};
      fromAnchor = {...allElems[bestAnchor.matchId], rect: {...fromRect}};
    }
  }

  const prepareCommonElems = () => {
    if (isEmpty(bestCommon)) return;
    console.log('bestCommon = ', bestCommon);
    toCommonRef = activeElems[bestCommon.id].receiveDispatch({type: actionTypes.COMMON_ELEMENT_GET_ELEM});
    fromCommonRef = allElems[bestCommon.matchId].receiveDispatch({type: actionTypes.COMMON_ELEMENT_GET_ELEM});
    if (toCommonRef && fromCommonRef) {
      const toRect = getElemPosition(toCommonRef);
      const fromRect = getElemPosition(fromCommonRef);
      toRect.top = toRect.top + newScrollData.scrollTop;
      fromRect.top = fromRect.top + newScrollData.scrollTop;
      toCommon = {...bestCommon, rect: {...toRect}};
      fromCommon = {...allElems[bestCommon.matchId], rect: {...fromRect}};
      fromCommonHTML = fromCommonRef.cloneNode(true).outerHTML;
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
        opacity: 1,
      },
      component: 'div',
      onClick: (e) => {
        e.preventDefault();
        if (reverse) {
          if (!reverseTl.paused()) {
            reverseTl.pause()
          } else {
            reverseTl.play();
          }

        } else {
          if (!tl.paused()) {
            tl.pause()
          } else {
            tl.play();
          }
        }
      }
    });

    const toStyle = toAnchor.rect.style, fromStyle = fromAnchor.rect.style;
    if (reverse) {
      fromAnchorHTML = fromAnchorRef.cloneNode(true).outerHTML;
      newBodyElems.push({
        render: (data) => {
          const style = {
            position: 'absolute',
            top: `${0}px`,
            left: `${0}px`,
            height: `${fromAnchor.rect.height}px`,
            width: `${fromAnchor.rect.width}px`,
            opacity: 1,
          };
          const containerStyle = {
            overflow: 'hidden',
            position: 'absolute',
            //top: `${newScroll + 88 - fromStyle.margin.top - fromStyle.margin.bottom - fromStyle.padding.top - fromStyle.padding.bottom}px`,
            //left: `${0}px`,
            //top: `${fromAnchor.data.rect.top + newScroll - fromStyle.margin.top - fromStyle.margin.bottom - fromStyle.padding.top - fromStyle.padding.bottom}px`,
            top: `${fromAnchor.rect.top + newScrollData.scrollTop}px`,
            left: `${fromAnchor.rect.left}px`,
            height: `${fromAnchor.rect.height}px`,
            width: `${fromAnchor.rect.width}px`,
            opacity: 1,
            backgroundColor: '#fafafa',
            zIndex: 2,
          };
          return (
            <div ref={(ref) => _fromAnchorContainerRef = ref} style={containerStyle}>
              <div ref={(ref) => _fromAnchorRef = ref} style={style} dangerouslySetInnerHTML={{__html: fromAnchorHTML}} />
            </div>
          );
        }
      });
    } else {
      if (toCommon && fromCommon) {
        toCommonRef.style.opacity = 0;
        commonXOffset = fromCommon.rect.left - toCommon.rect.left;
        // console.log('commonXOffset = ', commonXOffset);
        // console.log('commonXOffset w/Anchor = ', commonXOffset - fromAnchor.rect.left);
        commonXOffset -= fromAnchor.rect.left + 88;
        commonYOffset = fromCommon.rect.top - toCommon.rect.top;
        // console.log('commonYOffset = ', commonYOffset);
        commonYOffset -= fromAnchor.rect.top;
        // console.log('commonYOffset w/Anchor = ', commonYOffset);

      }
      toAnchorHTML = toAnchorRef.cloneNode(true).outerHTML; // so you can hide the commonElem before it is copied
      newBodyElems.push({
        render: (data) => {
          const style = {
            position: 'absolute',
            top: `${0}px`,
            left: `${0}px`,
            height: `${toAnchor.rect.height}px`,
            width: `${toAnchor.rect.width}px`,
            zIndex: 2,
            visibility: 'visible',
            transform: `translate(${commonXOffset - toStyle.margin.left - toStyle.margin.right - toStyle.padding.left - toStyle.padding.right}px, ${-toStyle.margin.top - toStyle.margin.bottom - toStyle.padding.top - toStyle.padding.bottom }px`,
            opacity: 0,
          };
          const containerStyle = {
            overflow: 'hidden',
            position: 'absolute',
            top: `${0}px`,
            left: `${0}px`,
            height: `${fromAnchor.rect.height}px`,
            width: `${fromAnchor.rect.width}px`,
            zIndex: 2,
            visibility: 'visible',
            backgroundColor: '#fafafa',
            transform: `translate(${fromAnchor.rect.left}px, ${fromAnchor.rect.top}px`,
            opacity: 0,
          };
          return (
            <div ref={(ref) => _toAnchorContainerRef = ref} style={containerStyle}>
              <div ref={(ref) => _toAnchorRef = ref} style={style} dangerouslySetInnerHTML={{__html: toAnchorHTML}} />
            </div>
          );
        }
      });
    }
    if (toCommon && fromCommon) {
      newBodyElems.push({
        render: (data) => {
          const style = {
            position: 'absolute',
            top: `${fromCommon.rect.top}px`,
            left: `${fromCommon.rect.left}px`,
            height: `${fromCommon.rect.height}px`,
            width: `${fromCommon.rect.width}px`,
            zIndex: 3,
          };
          return (
            <div ref={(ref) => _fromCommonRef = ref} style={style} dangerouslySetInnerHTML={{__html: fromCommonHTML}} />
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

  const prepareAnimation = () => {
    const toStyle = toAnchor.rect.style, fromStyle = fromAnchor.rect.style;
    if (reverse) {
      animation$ = Rx.Observable.create((observer) => {
        if (!_fromAnchorContainerRef || !_fromAnchorRef || !toAnchorRef || !fromAnchorRef) {
          observer.complete();
          return;
        }
        reverseTl = new TimelineMax({paused: true, onComplete: () => observer.complete()});
        if (toCommonRef) reverseTl.set(toCommonRef, {opacity: 0});
        if (unhideGroupChildRefs) reverseTl.set(unhideGroupChildRefs, {opacity: 1});
        reverseTl.set(fromAnchorRef, {opacity: 0})

          // toAnchorRef
          .set(toAnchorRef, {opacity: 0, zIndex: 3})
          .to(toAnchorRef, duration * 0.333, {opacity: 1}, duration * 0.2)
          .from(toAnchorRef, duration * .75, {
            y: fromAnchor.rect.top - toAnchor.rect.top,
            ease: surfaceExpandEase,
          }, 0)
          .from(toAnchorRef, duration * .85, {
            x: fromAnchor.rect.left - toAnchor.rect.left,
            ease: surfaceExpandEase,
          }, duration * .15)
          .to(toAnchorRef, duration * .333, {opacity: 1}, duration * 0.6)

          // fromAnchorContainerRef
          .to(_fromAnchorContainerRef, duration * .75, {
            height: toAnchor.rect.height,
            y: -fromAnchor.rect.top - fromStyle.margin.top - fromStyle.padding.top + toAnchor.rect.top + toStyle.margin.top + toStyle.padding.top,
            ease: surfaceExpandEase,
          }, 0)
          .to(_fromAnchorContainerRef, duration * .85, {
            width: toAnchor.rect.width,
            x: -fromAnchor.rect.left - fromStyle.margin.left - fromStyle.padding.left + toAnchor.rect.left + toStyle.margin.left + toStyle.padding.left,
            ease: surfaceExpandEase,
          }, duration * .15)

          // fromAnchorRef
          .to(_fromAnchorRef, duration * .4, {opacity: 0}, 0)
          .to(_fromAnchorRef, duration * .75, {
            y: -toStyle.margin.top - toStyle.padding.top,
            ease: surfaceExpandEase,
          }, 0)
          .to(_fromAnchorRef, duration * .85, {
            x: -toStyle.margin.left - toStyle.padding.left,
            ease: surfaceExpandEase,
          }, duration * .15)
          .set(toAnchorRef, {zIndex: toStyle.zIndex});
        if (_fromCommonRef) {
          reverseTl.to(_fromCommonRef, duration * .75, {
            height: toCommon.rect.height,
            y: toCommon.rect.top - fromCommon.rect.top,
            ease: surfaceExpandEase,
          }, 0)
            .to(_fromCommonRef, duration * .85, {
              x: toCommon.rect.left - fromCommon.rect.left,
              width: toCommon.rect.width,
              ease: surfaceExpandEase,
            }, duration * .15);
          if (toCommonRef) {
            reverseTl.set(toCommonRef, {opacity: 1});
          }
        }
        reverseTl.play(0);
      });
    } else {
      animation$ = Rx.Observable.create((observer) => {
        if (!fromAnchorRef || !_toAnchorContainerRef || !_toAnchorRef) {
          observer.complete();
          return;
        }
        tl = new TimelineMax({paused: true, onComplete: () => observer.complete()});
        if (unhideGroupChildRefs) tl.set(unhideGroupChildRefs, {opacity: 0});
        if (fromCommonRef) tl.set(fromCommonRef, {opacity: 0});
        if (toCommonRef) tl.set(toCommonRef, {opacity: 0});
        // fromAnchorRef
        tl.to(fromAnchorRef, duration * .75, {
            x: toAnchor.rect.left - fromAnchor.rect.left,
            ease: surfaceExpandEase,
          }, 0)
          .to(fromAnchorRef, duration * .85, {
            y: toAnchor.rect.top - fromAnchor.rect.top,
            ease: surfaceExpandEase,
          }, duration * .15)

          // toAnchorContainerRef
          .to(_toAnchorContainerRef, duration * .75, {
            width: toAnchor.rect.width,
            x: toAnchor.rect.left,
            ease: surfaceExpandEase,
          }, 0)
          .to(_toAnchorContainerRef, duration * .85, {
            height: toAnchor.rect.height,
            y: toAnchor.rect.top,
            ease: surfaceExpandEase,
          }, duration * .15)
          .to(_toAnchorContainerRef, duration * .2, {opacity: 1, onComplete: () => {tl.kill(null, fromAnchorRef)}}, 0)

          // toAnchorRef
          .to(_toAnchorRef, duration * .333, {opacity: 1}, duration * 0.2)
          .to(_toAnchorRef, duration * .75, {
            x: 0,
            ease: surfaceExpandEase,
          }, 0)
          .to(_toAnchorRef, duration * .85, {
            y: 0,
            ease: surfaceExpandEase,
          }, duration * .15);
        if (_fromCommonRef) {
          //commonCopy
          tl.to(_fromCommonRef, duration * .75, {
            x: toCommon.rect.left - fromCommon.rect.left,
            width: toCommon.rect.width,
            ease: surfaceExpandEase,
          }, 0)
            .to(_fromCommonRef, duration * .85, {
              height: toCommon.rect.height,
              y: toCommon.rect.top - fromCommon.rect.top,
              ease: surfaceExpandEase,
            }, duration * .15);
          if (toCommonRef) {
            tl.set(toCommonRef, {opacity: 1});
          }
        }
        tl.play(0);
      });
    }
  }
  prepareAnchors();
  if (toAnchor && fromAnchor) {
    prepareCommonElems();
    prepareBodyElems();
    if (addBodyElems$ && removeBodyElems$) {
      prepareAnimation();
      surfaceExpand$ = Rx.Observable.concat(addBodyElems$, animation$, removeBodyElems$);
    }
  }
  if (!surfaceExpand$) surfaceExpand$ = Rx.Observable.empty();
  return surfaceExpand$;
}


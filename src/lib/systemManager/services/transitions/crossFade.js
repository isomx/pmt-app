import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/empty';
import { actionTypes } from '../../actions/actionTypes';
import { getElemTypesOfChildren } from '../../store/helpers';
import { getElemPosition } from '../../utils/dom';
import isEmpty from 'lodash/isEmpty';

/**
 * NOTE: Figure out proper way to import GSAP. Doesn't seem to support modular imports very well.
 * Might be best to import it globally once vs using modules.
 * Simply using "import 'gsap'" works, but eslint fails because
 * TweenMax & TimelineMax are "undefined"...
 */
import TimelineMax from 'gsap/TimelineMax';
// import Quad from 'gsap/EasePack';
import 'gsap';

export const prepareCrossFade = ({ idsToAppear, idsToEnter, idsToLeave, allElems, activeElems }) => {
  const duration = 0.3;
  let
    //refsSet = [],
    refsToEnter = [],
    refsToLeave = [],
    toolbarsSet = [],
    toolbarsToEnter = [],
    toolbarsToLeave = [],
    drawersToEnter = [],
    drawersToLeave = [],
    animation$,
    tl;
  const idsToEnterOrAppear = [].concat(idsToAppear, idsToEnter);

  const prepareEnterRefs = () => {
    let refResp, group, groupChild, childTypes, elemPosition;
    for (let i = 0; i < idsToEnterOrAppear.length; i++) {
      groupChild = activeElems[idsToEnterOrAppear[i]];
      if (!groupChild) continue;
      group = activeElems[groupChild.parentId];
      if (!group) continue;
      refResp = group.receiveDispatch({
        type: actionTypes.GROUP_GET_CHILD_REF,
        payload: {
          groupChildId: groupChild.id,
        }
      });
      if (!refResp) continue;
      refsToEnter.push(refResp);
      childTypes = getElemTypesOfChildren(activeElems, groupChild.id);
      if (!isEmpty(childTypes)) {
        const toolbars = childTypes.sysMgrToolbar;
        const drawers = childTypes.sysMgrDrawer;
        if (toolbars && toolbars.length > 0) {
          for (let i = 0; i < toolbars.length; i++) {
            refResp = toolbars[i].receiveDispatch({
              type: actionTypes.TOOLBAR_GET_ELEM,
            });
            if (!refResp) continue;
            elemPosition = getElemPosition(refResp);
            toolbarsSet.push([
              refResp,
              {y: -elemPosition.height},
              0
            ]);
            toolbarsToEnter.push(refResp);
          }
        }
        if (drawers && drawers.length > 0) {
          for (let i = 0; i < drawers.length; i++) {
            refResp = drawers[i].receiveDispatch({
              type: actionTypes.DRAWER_GET_ELEM,
            });
            if (refResp) drawersToEnter.push(refResp);
          }
        }
      }
    }
  }

  const prepareLeaveRefs = () => {
    if (idsToLeave.length < 1) return;
    let refResp, group, groupChild, childTypes, elemPosition;
    for (let i = 0; i < idsToLeave.length; i++) {
      groupChild = allElems[idsToLeave[i]];
      if (!groupChild) continue;
      group = allElems[groupChild.parentId];
      if (!group) continue;
      refResp = group.receiveDispatch({
        type: actionTypes.GROUP_GET_CHILD_REF,
        payload: {
          groupChildId: groupChild.id,
        }
      });
      if (!refResp) continue;
      refsToLeave.push(refResp);
      /**
      style = refResp.currentStyle || window.getComputedStyle(refResp);
      if (style['position'] === 'absolute') {
        top = parseInt(style['top'], 10) || 0;
        refsSet.push([
          refResp,
          {y: -top},
          0
        ]);
      }
       **/
      childTypes = getElemTypesOfChildren(allElems, groupChild.id);
      if (!isEmpty(childTypes)) {
        const toolbars = childTypes.sysMgrToolbar;
        const drawers = childTypes.sysMgrDrawer;
        if (toolbars && toolbars.length > 0) {
          for (let i = 0; i < toolbars.length; i++) {
            refResp = toolbars[i].receiveDispatch({
              type: actionTypes.TOOLBAR_GET_ELEM,
            });
            if (!refResp) continue;
            elemPosition = getElemPosition(refResp);
            toolbarsSet.push([
              refResp,
              {y: -elemPosition.height},
              0
            ]);
            toolbarsToLeave.push(refResp);
          }
        }
        if (drawers && drawers.length > 0) {
          for (let i = 0; i < drawers.length; i++) {
            refResp = drawers[i].receiveDispatch({
              type: actionTypes.DRAWER_GET_ELEM,
            });
            if (refResp) drawersToLeave.push(refResp);
          }
        }
      }
    }
  }

  const prepareAnimation = () => {
    animation$ = Observable.create((observer) => {
      tl = new TimelineMax({paused: true, onComplete: () => {
        observer.complete();
      }});
      if (toolbarsSet && toolbarsSet.length > 0) {
        for (let i = 0; i < toolbarsSet.length; i++) {
          //tl.set(...toolbarsSet[i]);
        }
      }
      /**
      tl.to(refsToLeave, duration, {rotationY: 45, autoAlpha: 0, scale: 2.1, ease: Quad.easeInOut}, 0)
        .fromTo(refsToEnter, duration, {rotationY: 45, scale: 2.1, autoAlpha: 0}, {rotationY: 0,autoAlpha: 1, scale: 1, ease: Quad.easeInOut}, 0)
        .to(drawersToLeave, duration, {rotationY: 45, autoAlpha: 0, scale: 2.1, ease: Quad.easeInOut}, 0)
        .fromTo(drawersToEnter, duration, {rotationY: 45, scale: 2.1, autoAlpha: 0}, {rotationY: 0,autoAlpha: 1, scale: 1, ease: Quad.easeInOut},0)
        .set([...toolbarsToEnter, ...drawersToEnter, ...refsToEnter], { clearProps: 'transform'}, duration + (duration * 0.4))
       **/
      tl.to(refsToLeave, duration, {y: '+=' + 40, autoAlpha: 0}, 0)
        .fromTo(refsToEnter, duration, {y: '-=' + 40, autoAlpha: 0}, {y: '+=' + 40, autoAlpha: 1}, 0)
        .to(drawersToLeave, duration, {y: 40, autoAlpha: 0}, 0)
        .fromTo(drawersToEnter, duration, {y: -40, autoAlpha: 0}, {y: 0, autoAlpha: 1}, 0)
        .set([...toolbarsToEnter, ...drawersToEnter, ...refsToEnter], { clearProps: 'transform'}, duration)
      tl.play(0);
      if (idsToAppear.length < 1) {
        //tl.pause();
      }

    });
  }
  prepareEnterRefs();
  prepareLeaveRefs();
  prepareAnimation();
  if (!animation$) animation$ = Observable.empty();
  return animation$;
}
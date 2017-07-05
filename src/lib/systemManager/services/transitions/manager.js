import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/merge';
import forOwn from 'lodash/forOwn';
import isEmpty from 'lodash/isEmpty';
import { actionTypes } from '../../actions/actionTypes';
import { transitionTypes } from '../../actions/transitionTypes';
import { prepareSurfaceExpand } from './surfaceExpand';
import { prepareSurfaceMorph } from './surfaceMorph';
import { prepareCrossFade } from './crossFade';

/**
 * NOTE: Add CustomEase to /node_modules/gsap/src/uncompressed/easing & root folder (2 diff files)
 **/

const findTransitionElems = (activeElems, recPos) => {
  let bestAnchorVal = 0, bestCommonVal = 0, bestAnchor = null, bestCommon = null;
  let indexVal, matchId, anchorCheck;
  const recPathLength = recPos.path.length;
  forOwn(activeElems, (value, key, obj) => {
    if (value.parentId === 0) {
      value.matchCount = 1;
      value.matchVal = (recPos.names.indexOf(value.name) + 1) * (value.matchCount / recPathLength);
    } else if (obj[value.parentId].matchVal) {
      indexVal = recPos.names.indexOf(value.name);
      matchId = null; //to prevent overriding below extra section for detecting commonElements that aren't in the path already
      if (indexVal < 0 && value.type === 'commonElement') {
        indexVal = recPos.commonElements.names.indexOf(value.name);
        if (indexVal > -1) {
          // this is the same as lastIndex + 1, since it is not in the array, but is the child of an
          // anchor that was part of the recordedPath. RecordedPath does not include common elements,
          // unless the event is wrapped by one.
          matchId = recPos.commonElements.ids[indexVal];
          indexVal = recPathLength;
        }
      }
      if (indexVal > -1) {
        if (!matchId) matchId = recPos.path[indexVal]; //could have been selected in above commonElement section
        value.matchId = matchId;
        value.matchCount = obj[value.parentId].matchCount + 1;
        value.matchVal = (((indexVal + 1) * 2) * (value.matchCount / recPathLength)) + obj[value.parentId].matchVal;
        switch (value.type) {
          case 'anchor':
            if (value.matchVal > bestAnchorVal) {
              bestAnchorVal = value.matchVal;
              bestAnchor = value;
              if (bestCommon && bestCommon.id) {
                bestCommon = {};
                bestCommonVal = 0;
              }
            }
            break;
          case 'commonElement':
            if (bestAnchor && value.matchVal > bestCommonVal) {
              anchorCheck = value.path.split('||');
              anchorCheck.splice(anchorCheck.length - 1, 1);
              if (anchorCheck.indexOf(bestAnchor.id) > -1) {
                // the bestAnchor is in the path of the commonElement, ok to use
                bestCommonVal = value.matchVal;
                bestCommon = value;
              }
            }
            break;
          default:
        }
      } else {
        value.matchCount = obj[value.parentId].matchCount;
        value.matchVal = obj[value.parentId].matchVal;
      }
    }
  });
  return {
    bestAnchor,
    bestCommon,
  };
}

export const handleTransitions = (toTransition) => {
  let { allElems, activeElems, idsToEnter, idsToAppear, recordedPosition, transTypes, groupUpdate$, ...transGroups } = toTransition;
  delete transGroups.idsToLeave;
  let motionGroups = [];
  // identify groupChildIds that are hidden because they are entering or appearing for the 1st time
  let idsToEnterOrAppear = [];
  if (idsToEnter.length > 0) idsToEnterOrAppear.push(...idsToEnter);
  if (idsToAppear.length > 0) idsToEnterOrAppear.push(...idsToAppear);
  let motionStream$;
  let crossFadeStream$;

  const { surfaceExpand, surfaceMorph, crossFade } = transTypes;

  // Check for motion groups
  if (surfaceExpand.length > 0) {
    motionGroups.push(...surfaceExpand);
  }
  if (surfaceMorph.length > 0) {
    motionGroups.push(...surfaceMorph);
  }
  if (motionGroups.length > 0 && !isEmpty(recordedPosition)) {
    // handle motion groups
    const { bestAnchor, bestCommon } = findTransitionElems(activeElems, recordedPosition);
    let transElemPath;
    if (!isEmpty(bestAnchor)) {
      // identify if an "idToEnter" is within the path of the anchor/commonElement
      // if so, unhide it so it can be seen during the transition
      if (!isEmpty(bestCommon)) {
        transElemPath = bestCommon.path.split('||');
        transElemPath.splice(transElemPath.length - 1, 1);
      } else {
        transElemPath = bestAnchor.path.split('||');
        transElemPath.splice(transElemPath.length - 1, 1);
      }
      let unhideGroupChildRefs = [];
      let gcIndex, refResp, gcParentId;
      for (let i = 0; i < idsToEnterOrAppear.length; i++) {
        gcIndex = transElemPath.indexOf(idsToEnterOrAppear[i]);
        if (gcIndex > -1) {
          gcParentId = activeElems[idsToEnterOrAppear[i]] ? activeElems[idsToEnterOrAppear[i]].parentId : null;
          if (gcParentId && activeElems[gcParentId]) {
            refResp = activeElems[gcParentId].receiveDispatch({
              type: actionTypes.GROUP_GET_CHILD_REF,
              payload: {
                groupChildId: idsToEnterOrAppear[i],
              }
            });
            if (refResp) {
              unhideGroupChildRefs.push(refResp);
            }
          }
        }
      }
      if (motionGroups.length > 1) {
        // sort motionGroups, and select the group that has the lowest number, as it would be highest in the tree.
        // This is because if a component unmounts, all of its children do too.
        // This means that at best, you could have a tie in the tree (sibling/sibling), otherwise it will always get
        // the group highest in the tree. Easiest way to avoid this is not to trigger multiple transitions at once!
        motionGroups.sort((a, b) => (a - b));
      }
      if (transGroups[motionGroups[0]]) {
        switch (transGroups[motionGroups[0]].transitionType) {
          case transitionTypes.SURFACE_EXPAND:
            motionStream$ = prepareSurfaceExpand({
              bestAnchor,
              bestCommon,
              allElems,
              activeElems,
              unhideGroupChildRefs,
            });
            break;
          case transitionTypes.SURFACE_MORPH:
            motionStream$ = prepareSurfaceMorph({
              bestAnchor,
              allElems,
              activeElems,
              unhideGroupChildRefs,
            });
            break;
          default:
        }
      }
    }
  } else {
    motionStream$ = Observable.empty();
  }
  if (crossFade.length > 0) {
    let toCrossFade$ = [];
    for (let i = 0, cfLength = transTypes.crossFade.length; i < cfLength; i++) {
      if (transGroups[crossFade[i]]) {
        toCrossFade$.push(prepareCrossFade({
          idsToAppear: transGroups[crossFade[i]].idsToAppear,
          idsToEnter: transGroups[crossFade[i]].idsToEnter,
          idsToLeave: transGroups[crossFade[i]].idsToLeave,
          allElems,
          activeElems,
        }));
      }
    }
    crossFadeStream$ = toCrossFade$.length > 0 ? Observable.merge(...toCrossFade$) : Observable.empty();
  } else {
    crossFadeStream$ = Observable.empty();
  }
  const groupUpdater$ = Observable.merge(...groupUpdate$);
  const animations$ = Observable.merge(motionStream$, crossFadeStream$);
  const doTransition$ = Observable.concat(animations$, groupUpdater$);
  return doTransition$;
}

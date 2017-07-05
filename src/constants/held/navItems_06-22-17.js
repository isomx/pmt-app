import React from 'react';
import FontIcon from 'react-md/lib/FontIcons';
// import Avatar from 'react-md/lib/Avatars';
import { Link } from 'react-router-dom';
import rawRoutes from '../routes';

/**
 * Using a uniqueKey counter to enable the easy addition of dividers and subheaders, since dividers in
 * particular do not have anything to create a unique key with.
 * @type {number}
 */
let uniqueKey = 0;
function buildRealRoutes(route, parents = [], titlePrefix = '') {
  const prefix = `${parents.length ? '/' : ''}${parents.join('/')}/`;
  uniqueKey++;
  const {
    divider,
    subheader,
    path,
    label,
    leftIcon,
    nestedItems,
    component,
    pageTitle,
    ...props
  } = route;

  if (divider) {
    return {divider, key: 'divider' + uniqueKey, ...props};
  } else if (subheader) {
    return {
      primaryText: label,
      subheader,
      key: label + uniqueKey,
      ...props,
    };
  }

  let rNestedItems, rLeftIcon, rComponent, rPageTitle;
  rPageTitle = `${titlePrefix}${pageTitle ? pageTitle : ''}`;
  if (nestedItems) {
    rNestedItems = nestedItems.map(route => buildRealRoutes(
      route,
      parents.length ? [...parents, path] : [path],
      rPageTitle + ' - '
    ));
  }
  if (leftIcon) {
    rLeftIcon = <FontIcon>{leftIcon}</FontIcon>;
  }

  if (component) {
    rComponent = component;
  } else if (!nestedItems) {
    rComponent = Link;
  } else {
    rComponent = 'div';
  }

  let to, key;
  if (typeof path !== 'undefined' && !nestedItems) {
    to = `${prefix}${path}`;
    key = 'menu' + uniqueKey;
  } else {
    /*********
     *  If uncommented, the parent container will initiate a navigation action when clicked vs just opening
     *  NOTE: Must also change rComponent = 'div' to rComponent = Link  (above if/else statement)

    to = `${prefix}${path}`;

    *********/
    key = 'menuParent' + uniqueKey;
  }
  return {
    ...props,
    key,
    to,
    component: rComponent,
    leftIcon: rLeftIcon,
    nestedItems: rNestedItems,
    primaryText: label,
    pageTitle: rPageTitle,
  };
}

const routes = rawRoutes.map(route => buildRealRoutes(route));

function isNestedActive(nestedItems) {
  return nestedItems && nestedItems.some(({ to, nestedItems }) => to === location.pathname || isNestedActive(nestedItems));
}
let currPageTitle = '';
function updateActiveRoutes(route, pathname) {
  if (route.divider || route.subheader) {
    return route;
  }
  const { to, nestedItems, ...props} = route;
  /***** If you want both the parent menu AND the child to have the active class, use below **********/
  const active = to === pathname || isNestedActive(nestedItems);
  /***************
    If you only want the active child in the submenu to be active:
    const active = to === pathname;
    const nestedActive = isNestedActive(nestedItems);

    NOTE: Must also change defaultOpen prop below to: nestedItems && nestedActive
   *************/
  if (to === pathname) currPageTitle = props.pageTitle;
  delete props.pageTitle;
  return {
    ...props,
    to,
    active,
    defaultOpen: nestedItems && active,
    // defaultOpen: nestedItems && nestedActive,
    nestedItems: nestedItems && nestedItems.map(route => updateActiveRoutes(route, pathname)),
  };
}

export default function getNavItems(pathname = '') {
  currPageTitle = '';
  return {
    navItems: routes.map(route => updateActiveRoutes(route, pathname)),
    pageTitle: currPageTitle ? currPageTitle : 'Predictive Marketing',
  }
}
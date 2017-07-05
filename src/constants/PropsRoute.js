import React from 'react';
import { Route } from 'react-router-dom';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

export default PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}
/***
 * For creating protected routes - best to convert this to using connect()
const PropsRoutePrivate = ({ component, redirectTo, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return auth.loggedIn() ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect to={{
          pathname: redirectTo,
          state: { from: routeProps.location }
        }}/>
      );
    }}/>
  );
};
*******/


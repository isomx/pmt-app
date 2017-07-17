import { applyMiddleware, createStore } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import logicMiddleware from './middleware';
import createBrowserHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import reducers from './reducers';
// import {createLogger} from 'redux-logger';

/**
 * redux-thunk is installed as package. If you need it, include the thunk imported as:
 * -> import thunk from 'redux-thunk'
 * ...in applyMiddleWare()
 * NOTE: remove redux-thunk from package.json if you ultimately do not use.
 * You should not need it since using redux-logic
**/

/**
 * Create Logic Middleware
 * @deps is injected into each createLogic() middleware instance. Can be anything you might need.
 **/
const deps = {
  key: 'keyedVal1',
};
const logic = createLogicMiddleware(logicMiddleware, deps);

export const history = createBrowserHistory();
//const middleware = applyMiddleware(logic, routerMiddleware(history), createLogger());
const middleware = applyMiddleware(logic, routerMiddleware(history));
export default createStore(reducers, middleware);
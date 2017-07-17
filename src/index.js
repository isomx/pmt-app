import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import App from './containers/App';
import store, { history } from './store';
import rxjsConfig from 'recompose/rxjsObservableConfig';
import setObservableConfig from 'recompose/setObservableConfig';
setObservableConfig(rxjsConfig);

import WebFontLoader from 'webfontloader';

import './styles.scss';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route render={(props) =>
        <App {...props} />
      } />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

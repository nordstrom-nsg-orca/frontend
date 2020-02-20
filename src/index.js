import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Security } from '@okta/okta-react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './util/serviceWorker';

const config = {
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: process.env.REACT_APP_CLIENT_ID,
  pkce: false,
  tokenManager: {
    autoRenew: false
  },
  scopes: ['openid','profile','groups_whitelist']
};

function SecurityWrapper () {
  return (
    <Router>
      <Security {...config}>
        <App />
      </Security>
    </Router>
  );
}

ReactDOM.render(<SecurityWrapper />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

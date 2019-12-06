import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Security } from '@okta/okta-react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

const config = {
  issuer: 'https://nordstrom.oktapreview.com/oauth2/ausmbgds36nqid3rW0h7',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '0oaornpnbhhBAAGNW0h7',
  pkce: false
}

function SecurityWrapper() {
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

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import ACL from './pages/ACL';
import './App.css';

const OKTA_DOMAIN = 'dev-230697.okta.com';

const config = {
  issuer: 'https://' + OKTA_DOMAIN + '/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '0oa22xhhst5lRnCq6357',
  pkce: true
}

function App() {
  return (
    <Router>
      <Security {...config}>
        <Route path='/implicit/callback' component={ImplicitCallback}/>
        <SecureRoute path='/' exact={true} component={Dashboard}/>
        <SecureRoute path='/acl' component={ACL}/>
      </Security>
    </Router>
  );
}

export default App;

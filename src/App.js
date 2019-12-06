import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, withAuth } from '@okta/okta-react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ACL from './pages/ACL';
import Secret from './pages/Secret';


import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      auth: {
        user: null,
        authenticated: false,
      }
    };
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      this.setState({
        auth: {
          authenticated: authenticated,
          user: userinfo
        }
      });
    }
  }

  async componentDidMount() { this.checkAuthentication(); }
  async componentDidUpdate() { this.checkAuthentication(); }

  login() {
    if (!this.state.authenticated){
      this.props.auth.login('/dashboard');
    }
  }

  async logout() {
    await this.props.auth.logout('/');
    this.setState({
      auth: {
        authenticated: false,
        user: null
      }
    });
  }

  render() {
    return (
    	<Navbar auth={this.state.auth} logout={this.logout} login={this.login}>
        <Route path='/' exact={true} component={Home} />
        <Route path='/implicit/callback' component={ImplicitCallback} />
        <SecureRoute path='/dashboard' exact={true} component={Dashboard} />
        <SecureRoute path='/acl' component={ACL} />
        <SecureRoute path='/secret' component={Secret} />
      </Navbar>
    );
  }
}

export default withAuth(App);

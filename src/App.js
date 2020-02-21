import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, withAuth } from '@okta/okta-react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Navbar from 'components/Navbar';
import Router from 'components/Router';

import Home from 'pages/Home';
import APIDoc from 'pages/APIDoc';

import { lightTheme, darkTheme } from 'util/theme.js';
import tabs from 'util/pages.js';
import md5 from 'md5';
import base64 from 'base-64';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      auth: {
        user: null,
        authenticated: false,
        isDbUser: false
      },
      light: false
    };

    this.sessionTime = 1000 * 60 * 30;
    this.sessionTimer = null;
  }

  componentDidMount = async () => {
    this.checkAuthentication();
  }

  componentDidUpdate = async () => {
    if (!this.state.auth.authenticated) this.checkAuthentication();
  }

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    const auth = JSON.parse(localStorage.getItem('dbUserAuth'));
    if (authenticated && !this.state.auth.user && !this.state.auth.isDbUser) {
      const userinfo = await this.props.auth.getUser();
      const oAuthToken = await this.props.auth.getAccessToken();
      localStorage.setItem('token', 'Bearer ' + oAuthToken);
      // console.log(userinfo);
      this.sessionTimer = setInterval(this.logout, this.sessionTime);
      this.setState({
        auth: {
          authenticated: authenticated,
          user: userinfo,
          isDbUser: false
        }
      });
    } else if (auth && auth.authenticated && auth.isDbUser) {
      this.setState({
        auth: auth
      });
      this.sessionTimer = setInterval(this.adminLogout, this.sessionTime);
    }
  }

  changeTheme = (event, label) => {
    this.setState({ light: !this.state.light });
  }

  adminLogin = async (username, password) => {
    if (password === null || username === null) return;
    try {
      password = md5(password);
      const auth = base64.encode(`${username}:${password}`);

      const opts = {
        method: 'GET',
        headers: { Authorization: `Basic ${auth}` }
      };
      const response = await fetch(`${process.env.REACT_APP_DB_API_URL}/auth/login`, opts);
      if (response.status === 200) {
        this.sessionTimer = setInterval(this.adminLogout, this.sessionTime);
        const authState = {
          authenticated: true,
          user: { name: username, password: password },
          isDbUser: true
        };
        localStorage.setItem('dbUserAuth', JSON.stringify(authState));
        localStorage.setItem('token', 'Basic ' + auth);
        this.setState({
          auth: auth
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  adminLogout = () => {
    localStorage.clear();
    window.clearInterval(this.sessionTimer);
    this.setState({
      auth: {
        authenticated: false,
        user: null,
        isDbUser: false
      }
    });
  }

  login = () => {
    if (!this.state.auth.authenticated)
      this.props.auth.login('/dashboard');
  }

  logout = async () => {
    window.clearInterval(this.sessionTimer);
    localStorage.clear();
    await this.props.auth.logout('/');
    this.setState({
      auth: {
        authenticated: false,
        user: null,
        isDbUser: false
      }
    });
  }

  render () {
    const theme = this.state.light ? lightTheme : darkTheme;

    return (
      <div>
        <Route path='/api/doc' component={APIDoc} />
        {window.location.pathname !== '/api/doc' && (
          <ThemeProvider theme={{ ...createMuiTheme(), ...theme }}>
            <div style={{ background: theme.bodyBackground, minHeight: '100vh' }}>
              <Navbar auth={this.state.auth} logout={this.logout} adminLogout={this.adminLogout} tabs={tabs}>
                {!this.state.auth.authenticated && (
                  <Route path='/' exact render={(props) => <Home {...props} login={this.login} adminLogin={this.adminLogin} />} />
                )}
                {this.state.auth.authenticated && (
                  <Router auth={this.state.auth} changeTheme={this.changeTheme} light={this.state.light} />
                )}
                <Route path='/implicit/callback' component={ImplicitCallback} />
              </Navbar>
            </div>
          </ThemeProvider>
        )}
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};
export default withAuth(App);

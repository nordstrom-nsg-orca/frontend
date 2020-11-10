import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ImplicitCallback, withAuth } from '@okta/okta-react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';

import Navbar from 'components/Navbar';
import Router from 'components/Router';

import Home from 'pages/Home';
import APIDoc from 'pages/APIDoc';
import Error from 'pages/Error';

import { buildTheme } from 'util/theme.js';
// import generateTabs from 'util/pages.js';

import API from 'util/api.js';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      auth: {
        user: null,
        authenticated: null,
        isOrcaUser: false
      },
      settings: {
        theme: 'dark'
      },
      tabs: {},
      loginError: false
    };
    this.sessionTime = 1000 * 60 * 30;
    this.sessionTimer = null;
  }

  componentDidMount = async () => {
    this.checkAuthentication();
  }

  componentDidUpdate = async () => {
    if (this.state.auth.authenticated === null)
      this.checkAuthentication();
  }

  checkAuthentication = async () => {
    let authenticated = await this.props.auth.isAuthenticated();
    let token, user;
    let isOrcaUser = false;

    if (authenticated && !this.state.auth.user) {
      user = await this.props.auth.getUser();
      token = await this.props.auth.getAccessToken();
      token = `Bearer ${token}`;
    } else {
      const orcaUser = JSON.parse(localStorage.getItem('orcaUserAuth'));
      if (orcaUser && orcaUser.authenticated) {
        authenticated = true;
        isOrcaUser = true;
        token = orcaUser.token;
        user = orcaUser.user;
      } else {
        if (authenticated !== this.state.auth.authenticated)
          this.setState({ auth: { authenticated: authenticated } });
        return;
      }
    }

    localStorage.setItem('token', token);
    // console.log(token);

    // const allowedPages = await API.endpoint('/auth/page', { method: 'GET' }) || {};
    // const tabs = generateTabs(allowedPages.json);
    // console.log(tabs);
    const schemas = await API.GET('/schemas');
    console.log(schemas);
    this.sessionTimer = setInterval(this.logout, this.sessionTime);
    this.setState({
      schemas: schemas,
      auth: {
        authenticated: authenticated,
        user: user,
        isOrcaUser: isOrcaUser
      }
    });
  }

  changeSetting = (event) => {
    const target = event.currentTarget;
    const copy = { ...this.state.settings };
    copy[target.name] = event.target.value;
    this.setState({ settings: copy });
  }

  login = async event => {
    const type = event.currentTarget.name;
    if (type === 'orca') {
      this.setState({ loginError: false });
      event.preventDefault();
      const auth = await API.login(event.target.username.value, event.target.password.value);
      if (auth)
        this.setState({ auth: { authenticated: null } });
      else
        this.setState({ loginError: true });
    } else if (type === 'okta' && !this.state.auth.authenticated)
      this.props.auth.login('/');
  }

  logout = async () => {
    window.clearInterval(this.sessionTimer);
    localStorage.clear();
    await this.props.auth.logout('/');
    this.setState({
      auth: {
        authenticated: false,
        user: null,
        isOktaUser: false
      }
    });
  }

  render () {
    const theme = buildTheme(this.state.settings.theme);
    return (
      <div>
        <Route path='/api/doc' component={APIDoc} />
        {window.location.pathname !== '/api/doc' && (
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ background: 'theme.palette.background', minHeight: '100vh' }}>
              <Navbar auth={this.state.auth} logout={this.logout} schemas={this.state.schemas}>

                {this.state.auth.authenticated === false && (
                  <div>
                    <Switch>
                      <Route
                        exact
                        path='/'
                        render={(props) => <Home {...props} loginError={this.state.loginError} login={this.login} />}
                      />
                      <Route
                        render={(props) => <Error {...props} errorType='notFound' />}
                      />
                    </Switch>
                  </div>
                )}
                {this.state.auth.authenticated && (
                  <Router
                    auth={this.state.auth}
                    changeSetting={this.changeSetting}
                    settings={this.state.settings}
                    schemas={this.state.schemas}
                  />
                )}
                <Route
                  path='/implicit/callback'
                  component={ImplicitCallback}
                />

              </Navbar>
            </div>
          </MuiThemeProvider>
        )}
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};
export default withAuth(App);

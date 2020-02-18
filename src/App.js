import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, withAuth } from '@okta/okta-react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Navbar from 'components/Navbar';
import PageContent from 'components/PageContent';

import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import APIDoc from 'pages/APIDoc';
import Settings from 'pages/Settings';

import { lightTheme, darkTheme } from 'util/theme.js';
import tabs from 'util/pages.js';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      auth: {
        user: null,
        authenticated: false
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

  changeTheme = (event, label) => {
    this.setState({ light: !this.state.light });
  }

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      const oAuthToken = await this.props.auth.getAccessToken();
      localStorage.setItem('token', oAuthToken);
      console.log(oAuthToken);
      this.sessionTimer = setInterval(this.logout, this.sessionTime);
      this.setState({
        auth: {
          authenticated: authenticated,
          user: userinfo
        }
      });
    }
  }

  login = () => {
    if (!this.state.authenticated)
      this.props.auth.login('/dashboard');
  }

  logout = async () => {
    window.clearInterval(this.sessionTimer);
    await this.props.auth.logout('/');
    this.setState({
      auth: {
        authenticated: false,
        user: null
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
              <Navbar auth={this.state.auth} logout={this.logout} tabs={tabs}>
                {!this.state.auth.authenticated && (
                  <Route path='/' exact render={(props) => <Home {...props} login={this.login} />} />
                )}
                {this.state.auth.authenticated && (
                  <PageContent>
                    <Route path='/' exact component={Dashboard} />

                    {tabs.map((tab, index) => (
                      tab.pages.map((page, pindex) => (
                        <SecureRoute
                          key={pindex}
                          exact path={tab.url + page.url}
                          component={page.component}
                        />
                      ))
                    ))}

                    <SecureRoute exact path='/dashboard' component={Dashboard} />
                    <SecureRoute
                      path='/settings'
                      render={(props) => <Settings {...props} changeTheme={this.changeTheme} light={this.state.light} />}
                    />
                  </PageContent>
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

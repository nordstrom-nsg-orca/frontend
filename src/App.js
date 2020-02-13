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

import { lightTheme, darkTheme } from 'util/global.js';
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
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.sessionTime = 1000 * 60 * 30; // 30 minutes expiration time
    this.sessionTimer = null;
  }

  async componentDidMount () {
    this.checkAuthentication();
  }

  async componentDidUpdate () {
    if (!this.state.auth.authenticated) this.checkAuthentication();
  }

  changeTheme (event, label) {
    if (label === 'light' && !this.state.light) this.setState({ light: event.target.checked });
    else this.setState({ light: !event.target.checked });
  }

  async checkAuthentication () {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      const oAuthToken = await this.props.auth.getAccessToken();
      localStorage.setItem('token', oAuthToken);
      this.sessionTimer = setInterval(this.logout, this.sessionTime);
      this.setState({
        auth: {
          authenticated: authenticated,
          user: userinfo
        }
      });
    }
  }

  login () {
    if (!this.state.authenticated)
      this.props.auth.login('/dashboard');
  }

  async logout () {
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
        {window.location.pathname !== '/api/doc' &&
          <ThemeProvider theme={{ ...createMuiTheme(), ...theme }}>
            <div style={{ background: theme.bodyBackground, minHeight: '100vh' }}>
              <Navbar auth={this.state.auth} logout={this.logout} login={this.login} tabs={tabs}>
                {!this.state.auth.authenticated && <Route path='/' exact component={Home} />}
                {this.state.auth.authenticated &&
                  <PageContent>
                    <Route path='/' exact component={Dashboard} />
                    
                    {tabs.map((tab, index) => 
                      tab.pages.map((page, pindex) =>
                        <SecureRoute exact path={page.url} component={page.component} />
                      )
                    )}
                    
                    <SecureRoute path='/dashboard' exact component={Dashboard} />
                    <SecureRoute path='/settings' render={(props) => <Settings {...props} changeTheme={this.changeTheme} light={this.state.light} />} />
                  </PageContent>}
                <Route path='/implicit/callback' component={ImplicitCallback} />
              </Navbar>
            </div>
          </ThemeProvider>}
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};
export default withAuth(App);

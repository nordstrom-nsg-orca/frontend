import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, withAuth } from '@okta/okta-react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ACL from './pages/ACL';
import Server from './pages/Server';
import APIDoc from './pages/APIDoc';
import Settings from './pages/Settings';

import { lightTheme, darkTheme } from './global.js';

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
  }

  async componentDidMount () { this.checkAuthentication(); }

  async componentDidUpdate() {
    if (!this.state.auth.authenticated) { this.checkAuthentication(); }
  }

  changeTheme(event, label) {
    if (label === 'light' && !this.state.light) {
      this.setState({ light: event.target.checked });
    } else this.setState({ light: !event.target.checked });
  }


  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      const oAuthToken = await this.props.auth.getAccessToken();
      this.setState({
        auth: {
          authenticated: authenticated,
          user: userinfo,
          oAuthToken: oAuthToken
        }
      });
    }
  }


  login() {
    if (!this.state.authenticated) {
      this.props.auth.login('/dashboard');
    }
  }

  async logout() {
    await this.props.auth.logout('/');
    this.setState({
      auth: {
        authenticated: false,
        user: null,
        oAuthToken: null,
        apiToken: null
      }
    });
  }

  render() {
    const theme = this.state.light ? lightTheme: darkTheme;

    return (
      <div>
          <Route path='/api/doc' component={APIDoc}/>
         { window.location.pathname !== '/api/doc' &&
            <ThemeProvider theme={{...createMuiTheme(), ...theme}}>
              <div style={{background: theme.bodyBackground, minHeight: '100vh'}}>
                	<Navbar auth={this.state.auth} logout={this.logout} login={this.login}>
                    {!this.state.auth.authenticated && <Route path='/' exact={true} component={Home} />}
                    {this.state.auth.authenticated &&
                      <div>
                        <Route path='/' exact={true} component={Dashboard} />
                        <SecureRoute path='/acl' render={(props) => <ACL {...props} token={this.state.auth.oAuthToken} />} />
                        <SecureRoute path='/server' render={(props) => <Server {...props} token={this.state.auth.oAuthToken} />} />
                        <SecureRoute path='/dashboard' exact={true} component={Dashboard} />
                        <SecureRoute path='/settings' render={(props) => <Settings {...props} changeTheme={this.changeTheme} light={this.state.light} />}  />
                      </div>
                    }
                    <Route path='/implicit/callback' component={ImplicitCallback} />
                  </Navbar>

              </div>
            </ThemeProvider>
          }

      </div>

    );
  }
}

App.propTypes = {
   auth: React.PropTypes.auth.isRequired,
   // propBool: React.PropTypes.bool.isRequired,
   // propFunc: React.PropTypes.func,
   // propNumber: React.PropTypes.number,
   // propString: React.PropTypes.string,
   // propObject: React.PropTypes.object
}

export default withAuth(App);

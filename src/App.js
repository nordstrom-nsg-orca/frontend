import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, withAuth } from '@okta/okta-react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ACL from './pages/ACL';
import Secret from './pages/Secret';
import APIDoc from './pages/APIDoc';
import Settings from './pages/Settings';
import {lightTheme, darkTheme} from './global.js';
import { tokenExchange } from './util/api.js';

import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: {
        user: null,
        authenticated: false,
      },
      light: false,
    };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
  }

  async componentDidMount() { this.checkAuthentication(); }

  async componentDidUpdate() {
    if (!this.state.auth.authenticated) { this.checkAuthentication(); }
  }

  changeTheme(event, label) {
    if (label === 'light' && !this.state.light) {
      this.setState({light: event.target.checked, dark: !event.target.checked});
    } else this.setState({dark: event.target.checked, light: !event.target.checked});
  }


  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      const oAuthToken = await this.props.auth.getAccessToken();
      
      const apiToken = await tokenExchange(oAuthToken);
    
      this.setState({
        auth: {
          authenticated: authenticated,
          user: userinfo,
          oAuthToken: oAuthToken,
          apiToken: apiToken
        }
      });
    }
  }


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
        user: null,
        oAuthToken: null,
        apiToken: null
      }
    });
  }

  render() {
    let theme;
    if (this.state.light) {
      theme = lightTheme;
    } else theme = darkTheme;
    const main = {
      width: '100%',
      minHeight: '100vh',
      margin: '0 auto',
      padding: '0',
      background: theme.background,
      color: theme.color
    };
    return (
      <div style={main}>
          <Route path='/api/doc' component={APIDoc}/>
         { window.location.pathname !== '/api/doc' &&
            <div >
              <ThemeProvider theme={{...createMuiTheme(), ...theme}}>
              	<Navbar auth={this.state.auth} logout={this.logout} login={this.login}>
                  {!this.state.auth.authenticated && <Route path='/' exact={true} component={Home} />}
                  {this.state.auth.authenticated &&
                    <div>
                      <Route path='/' exact={true} component={Dashboard} />
                      <SecureRoute path='/acl' render={(props) => <ACL {...props} token={this.state.auth.apiToken} />} />
                      <SecureRoute path='/dashboard' exact={true} component={Dashboard} />
                      <SecureRoute path='/secret' component={Secret} />
                      <SecureRoute path='/settings' render={(props) => <Settings {...props} changeTheme={this.changeTheme} light={this.state.light} />}  />
                    </div>
                  }
                  <Route path='/implicit/callback' component={ImplicitCallback} />
                </Navbar>
              </ThemeProvider>
            </div>
          }

      </div>

    );
  }
}

export default withAuth(App);
